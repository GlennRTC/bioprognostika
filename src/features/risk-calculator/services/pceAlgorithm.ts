/**
 * Pooled Cohort Equations (PCE) Implementation
 * Based on 2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk
 * 
 * Educational Research Tool - Not for Clinical Use
 * Implements race and gender-specific risk calculations with lifestyle intervention modeling
 * Refactored to implement RiskCalculatorAlgorithm interface
 */

import { 
  PatientParams, 
  PCEPatientParams,
  RiskResult, 
  RiskCategory, 
  InterventionRequest, 
  InterventionScenario, 
  InterventionEffect,
  RiskCalculatorAlgorithm,
  ClinicalRecommendation,
  ClinicalReference
} from '@/types';
import { CLINICAL_REFERENCES } from './clinicalUtils';

// PCE Coefficients for different race/gender combinations
interface PCECoefficients {
  ln_age: number;
  ln_age_squared: number;
  ln_total_chol: number;
  ln_age_total_chol: number;
  ln_hdl_chol: number;
  ln_age_hdl_chol: number;
  ln_treated_sbp: number;
  ln_age_treated_sbp: number;
  ln_untreated_sbp: number;
  ln_age_untreated_sbp: number;
  smoking: number;
  ln_age_smoking: number;
  diabetes: number;
  individual_sum: number;
  baseline_survival: number;
}

const PCE_COEFFICIENTS: Record<string, PCECoefficients> = {
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
const INTERVENTION_EFFECTS: Record<string, InterventionEffect> = {
  smokingCessation: {
    riskReduction: 0.35, // 35% relative risk reduction
    timeFrame: '1-2 years',
    source: 'Critchley & Capewell 2003'
  },
  
  physicalActivity: {
    riskReduction: 0.25, // 25% relative risk reduction
    timeFrame: '3-6 months',
    source: 'Li et al. 2012 Meta-analysis'
  },
  
  bloodPressureReduction: {
    riskReductionPer10mmHg: 0.22, // 22% relative risk reduction
    timeFrame: '3-6 months',
    source: 'Ettehad et al. 2016',
    maxReduction: 20 // mmHg maximum realistic reduction
  },
  
  statinTherapy: {
    riskReduction: 0.25, // 25% relative risk reduction
    cholesterolReduction: 50, // mg/dL typical total cholesterol reduction
    timeFrame: '6-12 months',
    source: 'CTT Collaboration 2010'
  },
  
  weightLoss: {
    systolicBPReduction: 3, // mmHg per 5% weight loss
    riskReductionPer5Percent: 0.10, // 10% relative risk reduction
    timeFrame: '6-12 months',
    source: 'Wing et al. 2011'
  }
};

/**
 * PCE Risk Calculator Class implementing RiskCalculatorAlgorithm interface
 */
export class PCERiskCalculator implements RiskCalculatorAlgorithm {
  // Algorithm metadata
  readonly name = 'PCE';
  readonly version = '2013.1';
  readonly ageRange = { min: 40, max: 79 };
  readonly requiredParameters: (keyof PatientParams)[] = ['age', 'gender', 'race', 'systolicBP'];
  readonly optionalParameters: (keyof PatientParams)[] = [
    'diastolicBP', 'totalCholesterol', 'hdlCholesterol', 'diabetes', 'smoking', 'bpMedication', 'weight', 'height'
  ];

  private coefficients = PCE_COEFFICIENTS;
  private defaults = POPULATION_DEFAULTS;
  private interventions = INTERVENTION_EFFECTS;

  /**
   * Calculate 10-year ASCVD risk using PCE
   */
  calculateRisk(params: PatientParams): RiskResult {
    try {
      // Convert to PCE-compatible parameters
      const pceParams = this.convertToPCEParams(params);
      
      // Validate and normalize inputs
      const validationResult = this.validateInputs(params);
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '));
      }
      
      // Handle missing values with defaults
      const complete = this.applyDefaults({ ...pceParams, warnings: validationResult.warnings });
      
      // Calculate PCE risk
      const risk = this.computePCE(complete);
      
      // Format and return results
      return this.formatResults(risk, complete, params);
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        risk: 0,
        riskCategory: this.getRiskCategory(0),
        confidence: 'standard',
        algorithm: 'PCE',
        parameters: params,
        defaults_used: [],
        warnings: [],
        interpretation: '',
        disclaimer: this.getDisclaimer()
      };
    }
  }

  /**
   * Validate inputs with enhanced interface compliance
   */
  validateInputs(params: PatientParams): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required validations
    if (!params.age || params.age < this.ageRange.min || params.age > this.ageRange.max) {
      errors.push(`Age must be between ${this.ageRange.min}-${this.ageRange.max} years for PCE validation`);
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
    if (params.totalCholesterol && (params.totalCholesterol < 130 || params.totalCholesterol > 320)) {
      warnings.push('Total cholesterol outside typical range (130-320 mg/dL)');
    }

    if (params.hdlCholesterol && (params.hdlCholesterol < 20 || params.hdlCholesterol > 100)) {
      warnings.push('HDL cholesterol outside typical range (20-100 mg/dL)');
    }

    // Warn about unsupported PREVENT parameters
    if (params.eGFR || params.creatinine) {
      warnings.push('Kidney function parameters not used in PCE calculation. Consider PREVENT algorithm.');
    }

    if (params.nonHdlCholesterol) {
      warnings.push('Non-HDL cholesterol not used in PCE calculation. Consider PREVENT algorithm.');
    }

    if (params.statinUse !== undefined) {
      warnings.push('Statin use not used in PCE calculation. Consider PREVENT algorithm.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Convert enhanced PatientParams to PCE-compatible format
   */
  private convertToPCEParams(params: PatientParams): PCEPatientParams {
    return {
      age: params.age,
      gender: params.gender,
      race: params.race,
      systolicBP: params.systolicBP,
      diastolicBP: params.diastolicBP,
      totalCholesterol: params.totalCholesterol,
      hdlCholesterol: params.hdlCholesterol,
      diabetes: params.diabetes,
      smoking: params.smoking,
      bpMedication: params.bpMedication,
      weight: params.weight,
      height: params.height
    };
  }

  /**
   * Get clinical recommendations based on risk result
   */
  getRecommendations(riskResult: RiskResult): ClinicalRecommendation[] {
    const recommendations: ClinicalRecommendation[] = [];
    const risk = riskResult.risk;

    // Risk-based recommendations following 2019 AHA/ACC Guidelines
    if (risk >= 20) {
      recommendations.push({
        category: 'medication',
        priority: 'high',
        recommendation: 'High-intensity statin therapy recommended',
        evidence: 'Class I recommendation for ASCVD risk ≥20%',
        reference: CLINICAL_REFERENCES['pce-2013']
      });
    } else if (risk >= 7.5) {
      recommendations.push({
        category: 'medication',
        priority: 'medium',
        recommendation: 'Consider statin therapy after clinician-patient discussion',
        evidence: 'Class IIa recommendation for ASCVD risk 7.5-19.9%',
        reference: CLINICAL_REFERENCES['pce-2013']
      });
    }

    // Lifestyle recommendations for all risk levels
    recommendations.push({
      category: 'lifestyle',
      priority: 'high',
      recommendation: 'Heart-healthy lifestyle modifications',
      evidence: 'Class I recommendation for all patients',
      reference: CLINICAL_REFERENCES['pce-2013']
    });

    // Smoking cessation if applicable
    if (riskResult.parameters.smoking) {
      recommendations.push({
        category: 'lifestyle',
        priority: 'high',
        recommendation: 'Smoking cessation counseling and support',
        evidence: 'Reduces cardiovascular risk by ~35%',
        reference: CLINICAL_REFERENCES['smoking-cessation']
      });
    }

    // Blood pressure management
    if (riskResult.parameters.systolicBP > 130) {
      recommendations.push({
        category: 'lifestyle',
        priority: 'medium',
        recommendation: 'Blood pressure management and monitoring',
        evidence: 'Target <130/80 mmHg for most patients',
        reference: CLINICAL_REFERENCES['pce-2013']
      });
    }

    // Monitoring recommendations
    if (risk >= 5) {
      recommendations.push({
        category: 'monitoring',
        priority: 'medium',
        recommendation: 'Annual cardiovascular risk reassessment',
        evidence: 'Regular monitoring for intermediate to high-risk patients',
        reference: CLINICAL_REFERENCES['pce-2013']
      });
    }

    return recommendations;
  }

  /**
   * Get clinical citations used by PCE algorithm
   */
  getCitations(): ClinicalReference[] {
    return [
      CLINICAL_REFERENCES['pce-2013'],
      CLINICAL_REFERENCES['smoking-cessation'],
      CLINICAL_REFERENCES['statin-therapy']
    ];
  }

  /**
   * Apply population defaults for missing values
   */
  private applyDefaults(params: PatientParams & { warnings: string[] }): PatientParams & { warnings: string[]; defaults_used: string[] } {
    const complete = { ...params };
    const defaults_used: string[] = [];

    if (!complete.totalCholesterol) {
      complete.totalCholesterol = this.defaults.totalCholesterol;
      defaults_used.push('total cholesterol');
    }

    if (!complete.hdlCholesterol) {
      complete.hdlCholesterol = this.defaults.hdlCholesterol;
      defaults_used.push('HDL cholesterol');
    }

    // Ensure HDL <= Total cholesterol
    if (complete.hdlCholesterol && complete.totalCholesterol && 
        complete.hdlCholesterol > complete.totalCholesterol) {
      complete.hdlCholesterol = Math.min(complete.hdlCholesterol, complete.totalCholesterol - 10);
    }

    return { ...complete, defaults_used };
  }

  /**
   * Core PCE calculation algorithm
   */
  private computePCE(params: PatientParams): { risk: number; riskCategory: RiskCategory; genderNote?: string; confidence: 'standard' | 'lower' } {
    const { age, gender, race, systolicBP, totalCholesterol, hdlCholesterol, 
            diabetes = false, smoking = false, bpMedication = false } = params;

    // Determine coefficient set
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
      const coeffKey = `${race === 'black' ? 'black' : 'white'}_${gender}`;
      const result = this.calculateWithCoefficients(params, this.coefficients[coeffKey]);
      return { ...result, confidence: 'standard' };
    }
  }

  /**
   * Calculate risk with specific coefficient set
   */
  private calculateWithCoefficients(params: PatientParams, coeffs: PCECoefficients): { risk: number; riskCategory: RiskCategory } {
    const { age, systolicBP, totalCholesterol = 200, hdlCholesterol = 50, 
            diabetes = false, smoking = false, bpMedication = false } = params;

    // Natural log transformations
    const ln_age = Math.log(age);
    const ln_total_chol = Math.log(totalCholesterol);
    const ln_hdl_chol = Math.log(hdlCholesterol);
    const ln_sbp = Math.log(systolicBP);

    // Calculate individual sum
    const individualSum = 
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
      riskCategory: this.getRiskCategory(boundedRisk)
    };
  }

  /**
   * Categorize risk level based on 2019 AHA/ACC Guidelines
   */
  private getRiskCategory(risk: number): RiskCategory {
    if (risk < 5) return { level: 'low', color: '#22C55E', message: 'Low risk' };
    if (risk < 7.5) return { level: 'borderline', color: '#EAB308', message: 'Borderline risk' };
    if (risk < 20) return { level: 'intermediate', color: '#F97316', message: 'Intermediate risk' };
    return { level: 'high', color: '#EF4444', message: 'High risk' };
  }

  /**
   * Model lifestyle interventions
   */
  modelInterventions(baselineParams: PatientParams, interventions: InterventionRequest[]): InterventionScenario[] {
    const scenarios: InterventionScenario[] = [];
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
          if (intervention.reduction) {
            const newSBP = Math.max(90, baselineParams.systolicBP - intervention.reduction);
            modifiedParams = { ...modifiedParams, systolicBP: newSBP };
            scenarios.push({
              intervention: `Blood Pressure Reduction (${intervention.reduction} mmHg)`,
              effect: this.interventions.bloodPressureReduction,
              newRisk: this.calculateRisk(modifiedParams)
            });
          }
          break;

        case 'statin_therapy':
          const newTotalChol = Math.max(130, (baselineParams.totalCholesterol || 200) - (this.interventions.statinTherapy.cholesterolReduction || 50));
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
          const estimatedNewRisk: RiskResult = currentRisk.success ? {
            ...currentRisk,
            risk: currentRisk.risk * (1 - (this.interventions.physicalActivity.riskReduction || 0))
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
  private formatResults(riskData: any, params: any, originalParams: PatientParams): RiskResult {
    return {
      success: true,
      risk: riskData.risk,
      riskCategory: riskData.riskCategory,
      confidence: riskData.confidence || 'standard',
      algorithm: 'PCE',
      parameters: originalParams, // Use original enhanced parameters
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
  private generateInterpretation(risk: number): string {
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
  private getDisclaimer() {
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

// Export singleton instance
export const pceCalculator = new PCERiskCalculator();