/**
 * Pooled Cohort Equations (PCE) Implementation
 * Based on 2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk
 * 
 * Educational Research Tool - Not for Clinical Use
 * Implements race and gender-specific risk calculations with lifestyle intervention modeling
 */

// PCE Coefficients for different race/gender combinations
const PCE_COEFFICIENTS = {
  // Non-Hispanic White Women
  white_female: {
    ln_age: -29.799,
    ln_age_squared: 4.884,
    ln_total_chol: 13.540,
    ln_age_total_chol: -3.114,
    ln_hdl_chol: -13.578,
    ln_age_hdl_chol: 3.149,
    ln_treated_sbp: 2.019,
    ln_age_treated_sbp: 0.000,
    ln_untreated_sbp: 1.957,
    ln_age_untreated_sbp: 0.000,
    smoking: 7.574,
    ln_age_smoking: -1.665,
    diabetes: 0.661,
    individual_sum: -29.18,
    baseline_survival: 0.9665
  },
  
  // Non-Hispanic Black Women
  black_female: {
    ln_age: 17.114,
    ln_age_squared: 0.000,
    ln_total_chol: 0.940,
    ln_age_total_chol: 0.000,
    ln_hdl_chol: -18.920,
    ln_age_hdl_chol: 4.475,
    ln_treated_sbp: 29.291,
    ln_age_treated_sbp: -6.432,
    ln_untreated_sbp: 27.820,
    ln_age_untreated_sbp: -6.087,
    smoking: 0.691,
    ln_age_smoking: 0.000,
    diabetes: 0.874,
    individual_sum: 86.61,
    baseline_survival: 0.9533
  },
  
  // Non-Hispanic White Men
  white_male: {
    ln_age: 12.344,
    ln_age_squared: 0.000,
    ln_total_chol: 11.853,
    ln_age_total_chol: -2.664,
    ln_hdl_chol: -7.990,
    ln_age_hdl_chol: 1.769,
    ln_treated_sbp: 1.797,
    ln_age_treated_sbp: 0.000,
    ln_untreated_sbp: 1.764,
    ln_age_untreated_sbp: 0.000,
    smoking: 7.837,
    ln_age_smoking: -1.795,
    diabetes: 0.658,
    individual_sum: 61.18,
    baseline_survival: 0.9144
  },
  
  // Non-Hispanic Black Men
  black_male: {
    ln_age: 2.469,
    ln_age_squared: 0.000,
    ln_total_chol: 0.302,
    ln_age_total_chol: 0.000,
    ln_hdl_chol: -0.307,
    ln_age_hdl_chol: 0.000,
    ln_treated_sbp: 1.916,
    ln_age_treated_sbp: 0.000,
    ln_untreated_sbp: 1.809,
    ln_age_untreated_sbp: 0.000,
    smoking: 0.549,
    ln_age_smoking: 0.000,
    diabetes: 0.645,
    individual_sum: 19.54,
    baseline_survival: 0.8954
  }
};

// Population default values for missing parameters
const POPULATION_DEFAULTS = {
  totalCholesterol: 200, // mg/dL (population median)
  hdlCholesterol: 50,    // mg/dL (population median)
  systolicBP: 120       // mmHg (normal range)
};

// Evidence-based lifestyle intervention effects
const INTERVENTION_EFFECTS = {
  smokingCessation: {
    riskReduction: 0.35, // 35% relative risk reduction
    timeFrame: '1-2 years',
    source: 'Critchley & Capewell 2003'
  },
  
  physicalActivity: {
    // Sedentary to moderate activity (150+ min/week)
    riskReduction: 0.25, // 25% relative risk reduction
    timeFrame: '3-6 months',
    source: 'Li et al. 2012 Meta-analysis'
  },
  
  bloodPressureReduction: {
    // Per 10 mmHg systolic reduction
    riskReductionPer10mmHg: 0.22, // 22% relative risk reduction
    maxReduction: 20, // mmHg maximum realistic reduction
    timeFrame: '3-6 months',
    source: 'Ettehad et al. 2016'
  },
  
  statinTherapy: {
    // Typical statin effect on cholesterol
    riskReduction: 0.25, // 25% relative risk reduction
    cholesterolReduction: 50, // mg/dL typical total cholesterol reduction
    timeFrame: '6-12 months',
    source: 'CTT Collaboration 2010'
  },
  
  weightLoss: {
    // Per 5% body weight loss
    systolicBPReduction: 3, // mmHg per 5% weight loss
    riskReductionPer5Percent: 0.10, // 10% relative risk reduction
    timeFrame: '6-12 months',
    source: 'Wing et al. 2011'
  }
};

// Input validation ranges
const VALIDATION_RANGES = {
  age: { min: 40, max: 79, required: true },
  systolicBP: { min: 90, max: 200, required: true },
  diastolicBP: { min: 60, max: 120, required: false },
  totalCholesterol: { min: 130, max: 320, required: false },
  hdlCholesterol: { min: 20, max: 100, required: false },
  weight: { min: 80, max: 400 }, // lbs
  height: { min: 48, max: 84 }   // inches
};

/**
 * Main PCE Risk Calculator Class
 */
class PCERiskCalculator {
  constructor() {
    this.coefficients = PCE_COEFFICIENTS;
    this.defaults = POPULATION_DEFAULTS;
    this.interventions = INTERVENTION_EFFECTS;
    this.validation = VALIDATION_RANGES;
  }

  /**
   * Calculate 10-year ASCVD risk using PCE
   * @param {Object} params - Patient parameters
   * @returns {Object} Risk calculation results
   */
  calculateRisk(params) {
    try {
      // Validate and normalize inputs
      const validated = this.validateInputs(params);
      
      // Handle missing values with defaults
      const complete = this.applyDefaults(validated);
      
      // Calculate PCE risk
      const risk = this.computePCE(complete);
      
      // Format and return results
      return this.formatResults(risk, complete);
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        risk: null
      };
    }
  }

  /**
   * Validate input parameters
   */
  validateInputs(params) {
    const errors = [];
    const validated = { ...params };

    // Required validations
    if (!params.age || params.age < 40 || params.age > 79) {
      errors.push('Age must be between 40-79 years for PCE validation');
    }

    if (!params.gender || !['male', 'female', 'non-binary'].includes(params.gender)) {
      errors.push('Gender must be specified (male, female, or non-binary)');
    }

    if (!params.race || !['white', 'black', 'other'].includes(params.race)) {
      errors.push('Race must be specified for PCE calculation');
    }

    if (!params.systolicBP || params.systolicBP < 90 || params.systolicBP > 200) {
      errors.push('Systolic blood pressure must be between 90-200 mmHg');
    }

    // Optional validations with warnings
    const warnings = [];
    
    if (params.totalCholesterol && (params.totalCholesterol < 130 || params.totalCholesterol > 320)) {
      warnings.push('Total cholesterol outside typical range (130-320 mg/dL)');
    }

    if (params.hdlCholesterol && (params.hdlCholesterol < 20 || params.hdlCholesterol > 100)) {
      warnings.push('HDL cholesterol outside typical range (20-100 mg/dL)');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(', ')}`);
    }

    validated.warnings = warnings;
    return validated;
  }

  /**
   * Apply population defaults for missing values
   */
  applyDefaults(params) {
    const complete = { ...params };
    const defaults_used = [];

    if (!complete.totalCholesterol) {
      complete.totalCholesterol = this.defaults.totalCholesterol;
      defaults_used.push('total cholesterol');
    }

    if (!complete.hdlCholesterol) {
      complete.hdlCholesterol = this.defaults.hdlCholesterol;
      defaults_used.push('HDL cholesterol');
    }

    // Ensure HDL <= Total cholesterol
    if (complete.hdlCholesterol > complete.totalCholesterol) {
      complete.hdlCholesterol = Math.min(complete.hdlCholesterol, complete.totalCholesterol - 10);
    }

    complete.defaults_used = defaults_used;
    return complete;
  }

  /**
   * Core PCE calculation algorithm
   */
  computePCE(params) {
    const { age, gender, race, systolicBP, totalCholesterol, hdlCholesterol, 
            diabetes = false, smoking = false, bpMedication = false } = params;

    // Determine coefficient set
    let coeffKey;
    if (gender === 'non-binary') {
      // Calculate average of male and female risk
      const maleKey = race === 'black' ? 'black_male' : 'white_male';
      const femaleKey = race === 'black' ? 'black_female' : 'white_female';
      
      const maleRisk = this.calculateWithCoefficients(params, this.coefficients[maleKey]);
      const femaleRisk = this.calculateWithCoefficients(params, this.coefficients[femaleKey]);
      
      return {
        risk: (maleRisk.risk + femaleRisk.risk) / 2,
        riskCategory: this.getRiskCategory((maleRisk.risk + femaleRisk.risk) / 2),
        genderNote: 'Risk estimated using averaged male/female calculations',
        confidence: 'lower' // Lower confidence for non-binary estimates
      };
    } else {
      coeffKey = `${race === 'black' ? 'black' : 'white'}_${gender}`;
    }

    const result = this.calculateWithCoefficients(params, this.coefficients[coeffKey]);
    result.confidence = 'standard';
    return result;
  }

  /**
   * Calculate risk with specific coefficient set
   */
  calculateWithCoefficients(params, coeffs) {
    const { age, systolicBP, totalCholesterol, hdlCholesterol, 
            diabetes = false, smoking = false, bpMedication = false } = params;

    // Natural log transformations
    const ln_age = Math.log(age);
    const ln_total_chol = Math.log(totalCholesterol);
    const ln_hdl_chol = Math.log(hdlCholesterol);
    const ln_sbp = Math.log(systolicBP);

    // Calculate individual sum
    let individualSum = 
      coeffs.ln_age * ln_age +
      coeffs.ln_age_squared * ln_age * ln_age +
      coeffs.ln_total_chol * ln_total_chol +
      coeffs.ln_age_total_chol * ln_age * ln_total_chol +
      coeffs.ln_hdl_chol * ln_hdl_chol +
      coeffs.ln_age_hdl_chol * ln_age * ln_hdl_chol +
      (bpMedication ? coeffs.ln_treated_sbp : coeffs.ln_untreated_sbp) * ln_sbp +
      (bpMedication ? coeffs.ln_age_treated_sbp : coeffs.ln_age_untreated_sbp) * ln_age * ln_sbp +
      coeffs.smoking * (smoking ? 1 : 0) +
      coeffs.ln_age_smoking * ln_age * (smoking ? 1 : 0) +
      coeffs.diabetes * (diabetes ? 1 : 0);

    // Calculate 10-year risk
    const riskScore = individualSum - coeffs.individual_sum;
    const survivalProbability = Math.pow(coeffs.baseline_survival, Math.exp(riskScore));
    const tenYearRisk = (1 - survivalProbability) * 100;

    // Ensure risk is within reasonable bounds
    const boundedRisk = Math.max(0.1, Math.min(99.9, tenYearRisk));

    return {
      risk: Math.round(boundedRisk * 10) / 10, // Round to 1 decimal place
      riskCategory: this.getRiskCategory(boundedRisk),
      rawScore: riskScore
    };
  }

  /**
   * Categorize risk level based on 2019 AHA/ACC Guidelines
   */
  getRiskCategory(risk) {
    if (risk < 5) return { level: 'low', color: '#22C55E', message: 'Low risk' };
    if (risk < 7.5) return { level: 'borderline', color: '#EAB308', message: 'Borderline risk' };
    if (risk < 20) return { level: 'intermediate', color: '#F97316', message: 'Intermediate risk' };
    return { level: 'high', color: '#EF4444', message: 'High risk' };
  }

  /**
   * Model lifestyle interventions
   */
  modelInterventions(baselineParams, interventions) {
    const scenarios = [];
    let modifiedParams = { ...baselineParams };

    // Apply each intervention
    interventions.forEach(intervention => {
      switch (intervention.type) {
        case 'smoking_cessation':
          if (baselineParams.smoking) {
            modifiedParams = { ...modifiedParams, smoking: false };
            scenarios.push({
              intervention: 'Smoking Cessation',
              effect: this.interventions.smokingCessation,
              newRisk: this.calculateRisk(modifiedParams)
            });
          }
          break;

        case 'blood_pressure_reduction':
          const newSBP = Math.max(90, baselineParams.systolicBP - intervention.reduction);
          modifiedParams = { ...modifiedParams, systolicBP: newSBP };
          scenarios.push({
            intervention: `Blood Pressure Reduction (${intervention.reduction} mmHg)`,
            effect: this.interventions.bloodPressureReduction,
            newRisk: this.calculateRisk(modifiedParams)
          });
          break;

        case 'statin_therapy':
          const newTotalChol = Math.max(130, baselineParams.totalCholesterol - this.interventions.statinTherapy.cholesterolReduction);
          modifiedParams = { ...modifiedParams, totalCholesterol: newTotalChol };
          scenarios.push({
            intervention: 'Statin Therapy',
            effect: this.interventions.statinTherapy,
            newRisk: this.calculateRisk(modifiedParams)
          });
          break;

        case 'physical_activity':
          // Physical activity doesn't directly modify PCE parameters, but we can estimate effect
          const currentRisk = this.calculateRisk(baselineParams);
          const estimatedNewRisk = currentRisk.success ? {
            ...currentRisk,
            risk: currentRisk.risk * (1 - this.interventions.physicalActivity.riskReduction)
          } : currentRisk;
          
          scenarios.push({
            intervention: 'Increased Physical Activity',
            effect: this.interventions.physicalActivity,
            newRisk: estimatedNewRisk
          });
          break;
      }
    });

    return scenarios;
  }

  /**
   * Format final results
   */
  formatResults(riskData, params) {
    return {
      success: true,
      risk: riskData.risk,
      riskCategory: riskData.riskCategory,
      confidence: riskData.confidence || 'standard',
      parameters: {
        age: params.age,
        gender: params.gender,
        race: params.race,
        systolicBP: params.systolicBP,
        totalCholesterol: params.totalCholesterol,
        hdlCholesterol: params.hdlCholesterol,
        diabetes: params.diabetes || false,
        smoking: params.smoking || false,
        bpMedication: params.bpMedication || false
      },
      defaults_used: params.defaults_used || [],
      warnings: params.warnings || [],
      interpretation: this.generateInterpretation(riskData.risk),
      disclaimer: this.getDisclaimer(),
      genderNote: riskData.genderNote
    };
  }

  /**
   * Generate risk interpretation
   */
  generateInterpretation(risk) {
    const category = this.getRiskCategory(risk);
    
    let interpretation = `Your estimated 10-year risk of cardiovascular disease is ${risk}%, which is considered ${category.level} risk. `;
    
    if (risk < 5) {
      interpretation += "Continue maintaining healthy lifestyle habits.";
    } else if (risk < 7.5) {
      interpretation += "Consider lifestyle modifications and regular monitoring.";
    } else if (risk < 20) {
      interpretation += "Lifestyle changes and possible medical treatment may be beneficial.";
    } else {
      interpretation += "Strong consideration for medical treatment in addition to lifestyle changes.";
    }

    return interpretation;
  }

  /**
   * Get appropriate disclaimer
   */
  getDisclaimer() {
    return {
      primary: "This educational tool uses the 2013 ACC/AHA Pooled Cohort Equations for demonstration purposes only. Results are not intended for clinical decision-making.",
      limitations: [
        "Validated for ages 40-79 years only",
        "May overestimate risk in some populations",
        "Requires recent cholesterol values for accuracy",
        "Does not include family history or other risk factors",
        "Individual results may vary significantly"
      ],
      usage: "Educational Use Only - Consult healthcare providers for personalized risk assessment and treatment recommendations."
    };
  }
}

// Test cases for validation
const TEST_CASES = [
  {
    description: "Low-risk 45-year-old white female",
    inputs: {
      age: 45,
      gender: "female",
      race: "white",
      systolicBP: 120,
      totalCholesterol: 180,
      hdlCholesterol: 60,
      diabetes: false,
      smoking: false,
      bpMedication: false
    },
    expectedRisk: "2-4%"
  },
  {
    description: "High-risk 65-year-old white male",
    inputs: {
      age: 65,
      gender: "male",
      race: "white",
      systolicBP: 160,
      totalCholesterol: 240,
      hdlCholesterol: 35,
      diabetes: true,
      smoking: true,
      bpMedication: true
    },
    expectedRisk: "25-35%"
  },
  {
    description: "Non-binary 50-year-old",
    inputs: {
      age: 50,
      gender: "non-binary",
      race: "other",
      systolicBP: 140,
      totalCholesterol: 200,
      hdlCholesterol: 45,
      diabetes: false,
      smoking: false,
      bpMedication: false
    },
    expectedRisk: "5-15%"
  }
];

// Export for use in React application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PCERiskCalculator, TEST_CASES, INTERVENTION_EFFECTS, VALIDATION_RANGES };
}

// Global export for browser use
if (typeof window !== 'undefined') {
  window.PCERiskCalculator = PCERiskCalculator;
  window.PCE_TEST_CASES = TEST_CASES;
}