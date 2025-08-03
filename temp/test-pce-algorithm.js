/**
 * Test Suite for PCE Algorithm Implementation
 * Validates calculations against published PCE examples and clinical scenarios
 */

// Import the PCE calculator (Node.js style for testing)
const { PCERiskCalculator, TEST_CASES } = require('./pce-algorithm.js');

class PCETestSuite {
  constructor() {
    this.calculator = new PCERiskCalculator();
    this.testResults = [];
  }

  /**
   * Run all validation tests
   */
  runAllTests() {
    console.log('🧪 Starting PCE Algorithm Test Suite\n');
    
    this.testBasicCalculations();
    this.testInputValidation();
    this.testGenderHandling();
    this.testInterventionModeling();
    this.testEdgeCases();
    
    this.printSummary();
  }

  /**
   * Test basic PCE calculations against known examples
   */
  testBasicCalculations() {
    console.log('📊 Testing Basic PCE Calculations...');
    
    // Test Case 1: Low-risk white female (from ACC/AHA examples)
    const lowRiskFemale = {
      age: 45,
      gender: 'female',
      race: 'white',
      systolicBP: 120,
      totalCholesterol: 180,
      hdlCholesterol: 60,
      diabetes: false,
      smoking: false,
      bpMedication: false
    };
    
    const result1 = this.calculator.calculateRisk(lowRiskFemale);
    this.logTest('Low-risk white female', result1.success && result1.risk < 5, 
                 `Risk: ${result1.risk}% (expected <5%)`);

    // Test Case 2: High-risk white male
    const highRiskMale = {
      age: 65,
      gender: 'male',
      race: 'white',
      systolicBP: 160,
      totalCholesterol: 240,
      hdlCholesterol: 35,
      diabetes: true,
      smoking: true,
      bpMedication: true
    };
    
    const result2 = this.calculator.calculateRisk(highRiskMale);
    this.logTest('High-risk white male', result2.success && result2.risk > 20, 
                 `Risk: ${result2.risk}% (expected >20%)`);

    // Test Case 3: Black female with moderate risk
    const moderateRiskBlackFemale = {
      age: 55,
      gender: 'female',
      race: 'black',
      systolicBP: 140,
      totalCholesterol: 200,
      hdlCholesterol: 45,
      diabetes: false,
      smoking: false,
      bpMedication: false
    };
    
    const result3 = this.calculator.calculateRisk(moderateRiskBlackFemale);
    this.logTest('Moderate-risk black female', result3.success && result3.risk >= 5 && result3.risk <= 20, 
                 `Risk: ${result3.risk}% (expected 5-20%)`);
  }

  /**
   * Test input validation
   */
  testInputValidation() {
    console.log('\n🔍 Testing Input Validation...');
    
    // Test age validation
    const tooYoung = { age: 35, gender: 'male', race: 'white', systolicBP: 120 };
    const result1 = this.calculator.calculateRisk(tooYoung);
    this.logTest('Age too young (35)', !result1.success, 'Should reject age < 40');

    const tooOld = { age: 85, gender: 'female', race: 'white', systolicBP: 120 };
    const result2 = this.calculator.calculateRisk(tooOld);
    this.logTest('Age too old (85)', !result2.success, 'Should reject age > 79');

    // Test blood pressure validation
    const lowBP = { age: 50, gender: 'male', race: 'white', systolicBP: 80 };
    const result3 = this.calculator.calculateRisk(lowBP);
    this.logTest('BP too low (80)', !result3.success, 'Should reject SBP < 90');

    const highBP = { age: 50, gender: 'male', race: 'white', systolicBP: 220 };
    const result4 = this.calculator.calculateRisk(highBP);
    this.logTest('BP too high (220)', !result4.success, 'Should reject SBP > 200');

    // Test cholesterol defaults
    const missingChol = { age: 50, gender: 'male', race: 'white', systolicBP: 140 };
    const result5 = this.calculator.calculateRisk(missingChol);
    this.logTest('Missing cholesterol data', result5.success && result5.defaults_used.length > 0, 
                 'Should use defaults and succeed');
  }

  /**
   * Test gender handling including non-binary
   */
  testGenderHandling() {
    console.log('\n⚧️ Testing Gender Handling...');
    
    // Test standard male calculation
    const maleParams = {
      age: 50, gender: 'male', race: 'white', systolicBP: 140,
      totalCholesterol: 200, hdlCholesterol: 45, diabetes: false, smoking: false
    };
    const maleResult = this.calculator.calculateRisk(maleParams);
    
    // Test standard female calculation
    const femaleParams = { ...maleParams, gender: 'female' };
    const femaleResult = this.calculator.calculateRisk(femaleParams);
    
    // Test non-binary calculation (should be average)
    const nonBinaryParams = { ...maleParams, gender: 'non-binary' };
    const nonBinaryResult = this.calculator.calculateRisk(nonBinaryParams);
    
    this.logTest('Male calculation', maleResult.success, `Male risk: ${maleResult.risk}%`);
    this.logTest('Female calculation', femaleResult.success, `Female risk: ${femaleResult.risk}%`);
    this.logTest('Non-binary calculation', nonBinaryResult.success, `Non-binary risk: ${nonBinaryResult.risk}%`);
    
    // Non-binary should be between male and female (approximately)
    const isReasonableAverage = nonBinaryResult.risk >= Math.min(maleResult.risk, femaleResult.risk) &&
                               nonBinaryResult.risk <= Math.max(maleResult.risk, femaleResult.risk);
    this.logTest('Non-binary averaging', isReasonableAverage, 
                 'Non-binary risk should be between male and female estimates');
  }

  /**
   * Test lifestyle intervention modeling
   */
  testInterventionModeling() {
    console.log('\n🏃‍♂️ Testing Intervention Modeling...');
    
    const baselineParams = {
      age: 60, gender: 'male', race: 'white', systolicBP: 150,
      totalCholesterol: 220, hdlCholesterol: 40, diabetes: false, smoking: true
    };
    
    const baseline = this.calculator.calculateRisk(baselineParams);
    
    // Test smoking cessation
    const interventions = [
      { type: 'smoking_cessation' },
      { type: 'blood_pressure_reduction', reduction: 20 },
      { type: 'statin_therapy' },
      { type: 'physical_activity' }
    ];
    
    const scenarios = this.calculator.modelInterventions(baselineParams, interventions);
    
    this.logTest('Baseline calculation', baseline.success, `Baseline risk: ${baseline.risk}%`);
    this.logTest('Intervention scenarios', scenarios.length === 4, 
                 `Generated ${scenarios.length} intervention scenarios`);
    
    // Check that interventions reduce risk
    scenarios.forEach((scenario, index) => {
      if (scenario.newRisk.success) {
        const riskReduction = baseline.risk - scenario.newRisk.risk;
        this.logTest(`${scenario.intervention}`, riskReduction > 0, 
                     `Risk reduction: ${riskReduction.toFixed(1)}%`);
      }
    });
  }

  /**
   * Test edge cases and boundary conditions
   */
  testEdgeCases() {
    console.log('\n🎯 Testing Edge Cases...');
    
    // Test minimum age boundary
    const minAge = { age: 40, gender: 'female', race: 'white', systolicBP: 120 };
    const result1 = this.calculator.calculateRisk(minAge);
    this.logTest('Minimum age (40)', result1.success, 'Should accept age 40');

    // Test maximum age boundary
    const maxAge = { age: 79, gender: 'male', race: 'black', systolicBP: 130 };
    const result2 = this.calculator.calculateRisk(maxAge);
    this.logTest('Maximum age (79)', result2.success, 'Should accept age 79');

    // Test race "other" handling
    const otherRace = { age: 50, gender: 'female', race: 'other', systolicBP: 140 };
    const result3 = this.calculator.calculateRisk(otherRace);
    this.logTest('Other race', result3.success, 'Should handle "other" race category');

    // Test extreme cholesterol values
    const extremeChol = {
      age: 55, gender: 'male', race: 'white', systolicBP: 140,
      totalCholesterol: 320, hdlCholesterol: 20
    };
    const result4 = this.calculator.calculateRisk(extremeChol);
    this.logTest('Extreme cholesterol values', result4.success, 'Should handle extreme but valid cholesterol');

    // Test HDL > Total cholesterol correction
    const invalidChol = {
      age: 50, gender: 'female', race: 'white', systolicBP: 130,
      totalCholesterol: 150, hdlCholesterol: 180
    };
    const result5 = this.calculator.calculateRisk(invalidChol);
    this.logTest('HDL > Total cholesterol', result5.success, 'Should correct invalid cholesterol ratios');
  }

  /**
   * Log individual test result
   */
  logTest(testName, passed, details) {
    const status = passed ? '✅' : '❌';
    console.log(`  ${status} ${testName}: ${details}`);
    this.testResults.push({ name: testName, passed, details });
  }

  /**
   * Print test summary
   */
  printSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter(t => t.passed).length;
    const failed = total - passed;

    console.log('\n📋 Test Summary');
    console.log('===============');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ${failed > 0 ? '❌' : '✅'}`);
    console.log(`Success Rate: ${Math.round((passed / total) * 100)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults.filter(t => !t.passed).forEach(test => {
        console.log(`  - ${test.name}: ${test.details}`);
      });
    }

    console.log('\n🎉 PCE Algorithm Testing Complete!\n');
  }

  /**
   * Demonstration of typical use cases
   */
  demonstrateUsage() {
    console.log('🎯 PCE Calculator Usage Examples\n');
    
    // Example 1: Basic risk calculation
    const patient1 = {
      age: 55,
      gender: 'male',
      race: 'white',
      systolicBP: 140,
      totalCholesterol: 220,
      hdlCholesterol: 45,
      diabetes: false,
      smoking: true,
      bpMedication: false
    };

    const result1 = this.calculator.calculateRisk(patient1);
    console.log('Example 1 - 55-year-old male smoker:');
    console.log(`  Risk: ${result1.risk}% (${result1.riskCategory.level})`);
    console.log(`  Category: ${result1.riskCategory.message}`);
    console.log(`  Interpretation: ${result1.interpretation}\n`);

    // Example 2: Intervention modeling
    const interventions = [
      { type: 'smoking_cessation' },
      { type: 'blood_pressure_reduction', reduction: 15 }
    ];

    const scenarios = this.calculator.modelInterventions(patient1, interventions);
    console.log('Example 2 - Intervention scenarios:');
    scenarios.forEach(scenario => {
      const reduction = result1.risk - scenario.newRisk.risk;
      console.log(`  ${scenario.intervention}: ${scenario.newRisk.risk}% (↓${reduction.toFixed(1)}%)`);
    });
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const testSuite = new PCETestSuite();
  testSuite.runAllTests();
  testSuite.demonstrateUsage();
}

module.exports = PCETestSuite;