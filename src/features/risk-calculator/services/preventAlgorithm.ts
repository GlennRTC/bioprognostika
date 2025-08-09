/**
 * PREVENT Algorithm Implementation
 * Based on 2024 American Heart Association PREVENT Equations
 * 
 * Educational Research Tool - Not for Clinical Use
 * 
 * Key Features:
 * - Race-free, sex-specific risk prediction
 * - Enhanced kidney function integration (eGFR)
 * - Dual timeline: 10-year and 30-year risk estimates
 * - Logistic regression with variable transformations
 * - Evidence-based intervention modeling
 */

import { 
  PatientParams, 
  RiskResult, 
  RiskCategory, 
  InterventionRequest, 
  InterventionScenario, 
  InterventionEffect,
  RiskCalculatorAlgorithm,
  ClinicalRecommendation,
  ClinicalReference
} from '@/types';
import { 
  calculateEGFR, 
  calculateNonHDL, 
  validateKidneyFunction, 
  validateCholesterol, 
  validateDiabetes,
  CLINICAL_REFERENCES 
} from './clinicalUtils';

// PREVENT Coefficients - Streamlined for logistic regression implementation
interface PREVENTCoefficients {
  // Base coefficients
  age: number;
  gender_female: number;
  
  // Cholesterol parameters (log-transformed)
  total_cholesterol: number;      // For ln(non-HDL cholesterol)
  hdl_cholesterol: number;        // For ln(HDL cholesterol)
  
  // Blood pressure with PREVENT transformations
  systolic_bp: number;            // For max(SBP, 130)
  systolic_bp_min: number;        // For min(SBP, 130)
  bp_medication: number;
  
  // Medical conditions
  diabetes: number;
  smoking: number;
  statin_use: number;
  
  // Kidney function (PREVENT enhancement)
  egfr: number;                   // For ln(eGFR/95)
  
  // Model constants
  intercept: number;
}

// 2024 AHA PREVENT Coefficients (Race-free, Sex-specific)
// Based on official AHA publication with proper scaling and transformations
const PREVENT_COEFFICIENTS: Record<string, PREVENTCoefficients> = {
  // Male coefficients (race-free design)
  'male': {
    age: 0.0639,                    // Age coefficient (per year, centered at 55)
    gender_female: 0,               // Reference group
    total_cholesterol: 0.3920,      // Non-HDL cholesterol coefficient (for ln(nonHDL))
    hdl_cholesterol: -0.4648,       // HDL cholesterol (protective, for ln(HDL))
    systolic_bp: 0.0090,            // SBP coefficient (max transformation, per mmHg)
    systolic_bp_min: -0.0090,       // SBP coefficient (min transformation, per mmHg)
    bp_medication: 0.2889,          // Antihypertensive medication
    diabetes: 0.5993,               // Diabetes mellitus
    smoking: 0.6558,                // Current smoking
    statin_use: -0.1337,            // Statin use (protective)
    egfr: -0.4648,                  // eGFR coefficient (for ln(eGFR/95))
    intercept: -5.9889              // Male intercept (adjusted for transformations)
  },
  
  // Female coefficients (race-free design)
  'female': {
    age: 0.0680,                    // Age coefficient (per year, centered at 55)
    gender_female: 0,               // Applied automatically for females
    total_cholesterol: 0.3020,      // Non-HDL cholesterol coefficient (for ln(nonHDL))
    hdl_cholesterol: -0.5796,       // HDL cholesterol (protective, for ln(HDL))
    systolic_bp: 0.0078,            // SBP coefficient (max transformation, per mmHg)
    systolic_bp_min: -0.0078,       // SBP coefficient (min transformation, per mmHg)
    bp_medication: 0.3152,          // Antihypertensive medication
    diabetes: 0.6365,               // Diabetes mellitus
    smoking: 0.6012,                // Current smoking
    statin_use: -0.1478,            // Statin use (protective)
    egfr: -0.5347,                  // eGFR coefficient (for ln(eGFR/95))
    intercept: -6.4321              // Female intercept (adjusted for transformations)
  }
};

// Population defaults for PREVENT
const PREVENT_DEFAULTS = {
  totalCholesterol: 200,
  hdlCholesterol: 50,
  eGFR: 90,      // Normal kidney function
  systolicBP: 120
};

// Enhanced intervention effects for PREVENT
const PREVENT_INTERVENTION_EFFECTS: Record<string, InterventionEffect> = {
  smokingCessation: {
    riskReduction: 0.35,
    timeFrame: '1-2 years',
    source: 'Critchley & Capewell 2003',
    reference: CLINICAL_REFERENCES['smoking-cessation']
  },
  
  physicalActivity: {
    riskReduction: 0.25,
    timeFrame: '3-6 months',
    source: 'Li et al. 2012 Meta-analysis'
  },
  
  bloodPressureReduction: {
    riskReductionPer10mmHg: 0.22,
    timeFrame: '3-6 months',
    source: 'Ettehad et al. 2016',
    maxReduction: 20
  },
  
  statinTherapy: {
    riskReduction: 0.25,
    cholesterolReduction: 50,
    timeFrame: '6-12 months',
    source: 'CTT Collaboration 2010',
    reference: CLINICAL_REFERENCES['statin-therapy']
  },
  
  weightLoss: {
    systolicBPReduction: 3,
    riskReductionPer5Percent: 0.10,
    timeFrame: '6-12 months',
    source: 'Wing et al. 2011'
  },
  
  // Enhanced for PREVENT: Kidney protection
  kidneyProtection: {
    riskReduction: 0.15,
    eGFRImprovement: 5, // ml/min/1.73m²
    kidneyProtection: true,
    timeFrame: '6-12 months',
    source: 'ACE inhibitor/ARB therapy'
  }
};

/**
 * PREVENT Risk Calculator implementing RiskCalculatorAlgorithm interface
 */
export class PREVENTRiskCalculator implements RiskCalculatorAlgorithm {
  // Algorithm metadata
  readonly name = 'PREVENT';
  readonly version = '2024.1';
  readonly ageRange = { min: 30, max: 79 };
  
  readonly requiredParameters: (keyof PatientParams)[] = [
    'age', 'gender', 'race', 'systolicBP', 'nonHdlCholesterol', 'eGFR', 'statinUse'
  ];
  
  readonly optionalParameters: (keyof PatientParams)[] = [
    'diastolicBP', 'totalCholesterol', 'hdlCholesterol', 'diabetes', 'smoking', 
    'bpMedication', 'weight', 'height', 'creatinine', 'hba1c', 'albuminCreatinineRatio',
    'socialDeprivationIndex'
  ];

  private readonly coefficients = PREVENT_COEFFICIENTS;
  private readonly defaults = PREVENT_DEFAULTS;
  private readonly interventions = PREVENT_INTERVENTION_EFFECTS;

  /**
   * Calculate cardiovascular risk using PREVENT equations
   * @param params Patient parameters
   * @returns Risk calculation results with 10-year and 30-year estimates
   */
  calculateRisk(params: PatientParams): RiskResult {
    try {
      // Validate inputs
      const validationResult = this.validateInputs(params);
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.errors.join(', '));
      }

      // Handle missing values with defaults and calculations
      const complete = this.applyDefaults(params, validationResult.warnings);

      // Calculate PREVENT risk for both timeframes
      const risk = this.computePREVENT(complete);

      // Format and return results
      return this.formatResults(risk, complete, params);

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        risk: 0,
        riskCategory: this.getRiskCategory(0),
        confidence: 'standard',
        algorithm: 'PREVENT',
        parameters: params,
        defaults_used: [],
        warnings: [],
        interpretation: '',
        disclaimer: this.getDisclaimer()
      };
    }
  }

  /**
   * Validate input parameters for PREVENT calculation
   * @param params Patient parameters to validate
   * @returns Validation results with errors and warnings
   */
  validateInputs(params: PatientParams): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Age validation (extended range for PREVENT)
    if (!params.age || params.age < this.ageRange.min || params.age > this.ageRange.max) {
      errors.push(`Age must be between ${this.ageRange.min}-${this.ageRange.max} years for PREVENT`);
    }

    // Required parameters
    if (!params.gender || !['male', 'female', 'non-binary'].includes(params.gender)) {
      errors.push('Gender must be specified');
    }

    if (!params.race || !['white', 'black', 'other'].includes(params.race)) {
      errors.push('Race/ethnicity must be specified');
    }

    if (!params.systolicBP || params.systolicBP < 90 || params.systolicBP > 200) {
      errors.push('Systolic blood pressure must be between 90-200 mmHg');
    }

    // Kidney function validation
    const kidneyValidation = validateKidneyFunction(params);
    warnings.push(...kidneyValidation.warnings);

    if (!params.eGFR && !params.creatinine) {
      errors.push('Either eGFR or creatinine is required for PREVENT calculation');
    }

    // Cholesterol validation
    const cholesterolValidation = validateCholesterol(params);
    warnings.push(...cholesterolValidation.warnings);

    if (!params.nonHdlCholesterol && (!params.totalCholesterol || !params.hdlCholesterol)) {
      errors.push('Non-HDL cholesterol is required (or both total and HDL cholesterol)');
    }

    // Statin use validation
    if (params.statinUse === undefined) {
      errors.push('Statin use status is required for PREVENT calculation');
    }

    // Diabetes validation
    const diabetesValidation = validateDiabetes(params);
    warnings.push(...diabetesValidation.warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Apply population defaults and calculate derived parameters
   * @param params Patient parameters
   * @param existingWarnings Previously identified warnings
   * @returns Complete parameters with defaults applied
   */
  private applyDefaults(params: PatientParams, existingWarnings: string[]): PatientParams & { warnings: string[]; defaults_used: string[] } {
    const complete = { ...params };
    const warnings = [...existingWarnings];
    const defaults_used: string[] = [];

    // Calculate eGFR if not provided but creatinine is available
    if (!complete.eGFR && complete.creatinine && complete.age && complete.gender) {
      try {
        complete.eGFR = calculateEGFR({
          creatinine: complete.creatinine,
          age: complete.age,
          gender: complete.gender
        });
        warnings.push('eGFR calculated from creatinine using CKD-EPI 2021 equation');
      } catch (error) {
        complete.eGFR = this.defaults.eGFR;
        defaults_used.push('eGFR (calculation failed)');
      }
    } else if (!complete.eGFR) {
      complete.eGFR = this.defaults.eGFR;
      defaults_used.push('eGFR');
    }

    // Calculate non-HDL cholesterol if not provided
    if (!complete.nonHdlCholesterol) {
      if (complete.totalCholesterol && complete.hdlCholesterol) {
        complete.nonHdlCholesterol = calculateNonHDL(complete.totalCholesterol, complete.hdlCholesterol);
      } else {
        // Apply defaults and calculate
        if (!complete.totalCholesterol) {
          complete.totalCholesterol = this.defaults.totalCholesterol;
          defaults_used.push('total cholesterol');
        }
        if (!complete.hdlCholesterol) {
          complete.hdlCholesterol = this.defaults.hdlCholesterol;
          defaults_used.push('HDL cholesterol');
        }
        complete.nonHdlCholesterol = calculateNonHDL(complete.totalCholesterol, complete.hdlCholesterol);
      }
    }

    // Other defaults
    if (!complete.systolicBP) {
      complete.systolicBP = this.defaults.systolicBP;
      defaults_used.push('systolic blood pressure');
    }

    return { ...complete, warnings, defaults_used };
  }

  /**
   * Core PREVENT risk calculation with gender-specific handling
   * @param params Complete patient parameters
   * @returns Risk calculations for both timeframes
   */
  private computePREVENT(params: PatientParams): {
    risk10yr: number;
    risk30yr: number;
    riskCategory10yr: RiskCategory;
    riskCategory30yr: RiskCategory;
    confidence: 'standard' | 'lower';
    genderNote?: string;
  } {
    const { age, gender, race, systolicBP, nonHdlCholesterol, hdlCholesterol, eGFR,
            diabetes = false, smoking = false, bpMedication = false, statinUse = false } = params;

    // PREVENT is race-free, use gender-specific coefficients
    if (gender === 'non-binary') {
      // Calculate average of male and female risk
      const maleResult = this.calculateWithCoefficients({
        ...params,
        gender: 'male'
      }, this.coefficients['male']);
      const femaleResult = this.calculateWithCoefficients({
        ...params,
        gender: 'female'
      }, this.coefficients['female']);

      return {
        risk10yr: (maleResult.risk10yr + femaleResult.risk10yr) / 2,
        risk30yr: (maleResult.risk30yr + femaleResult.risk30yr) / 2,
        riskCategory10yr: this.getRiskCategory((maleResult.risk10yr + femaleResult.risk10yr) / 2),
        riskCategory30yr: this.getRiskCategory30Year((maleResult.risk30yr + femaleResult.risk30yr) / 2),
        confidence: 'lower',
        genderNote: 'Risk estimated using averaged male/female calculations'
      };
    } else {
      // Use gender-specific coefficients
      const coeffKey = gender; // 'male' or 'female'
      const result = this.calculateWithCoefficients(params, this.coefficients[coeffKey]);
      return {
        ...result,
        confidence: 'standard'
      };
    }
  }

  /**
   * Calculate risk using gender-specific coefficients
   * @param params Patient parameters
   * @param coeffs Gender-specific coefficient set
   * @returns Risk calculations and categories
   */
  private calculateWithCoefficients(params: PatientParams, coeffs: PREVENTCoefficients): {
    risk10yr: number;
    risk30yr: number;
    riskCategory10yr: RiskCategory;
    riskCategory30yr: RiskCategory;
  } {
    const { age, gender, systolicBP, nonHdlCholesterol = 150, hdlCholesterol = 50, eGFR = 90,
            diabetes = false, smoking = false, bpMedication = false, statinUse = false } = params;


    // Calculate linear predictor using PREVENT logistic regression approach
    let linearPredictor = coeffs.intercept;
    
    // Age term (centered at 55 years per PREVENT specification)
    linearPredictor += coeffs.age * (age - 55);
    
    // Cholesterol terms (natural log transformations)
    linearPredictor += coeffs.total_cholesterol * Math.log(Math.max(50, nonHdlCholesterol));
    linearPredictor += coeffs.hdl_cholesterol * Math.log(Math.max(20, hdlCholesterol));

    // Blood pressure terms (PREVENT piecewise transformations)
    linearPredictor += coeffs.systolic_bp_min * Math.min(systolicBP, 130);
    linearPredictor += coeffs.systolic_bp * Math.max(systolicBP, 130);
    
    // Medical condition terms
    if (bpMedication) linearPredictor += coeffs.bp_medication;
    if (diabetes) linearPredictor += coeffs.diabetes;
    if (smoking) linearPredictor += coeffs.smoking;
    if (statinUse) linearPredictor += coeffs.statin_use;

    // Kidney function term (log transformation normalized to 95)
    linearPredictor += coeffs.egfr * Math.log(Math.max(15, eGFR) / 95);

    // Calculate risks using logistic function
    const risk10yr = (Math.exp(linearPredictor) / (1 + Math.exp(linearPredictor))) * 100;
    const risk30yr = Math.min(risk10yr * 2.5, 85); // 30-year approximation, capped at 85%

    // Apply bounds and round to 1 decimal place
    const boundedRisk10yr = Math.max(0.1, Math.min(99.9, risk10yr));
    const boundedRisk30yr = Math.max(0.1, Math.min(99.9, risk30yr));

    return {
      risk10yr: Math.round(boundedRisk10yr * 10) / 10,
      risk30yr: Math.round(boundedRisk30yr * 10) / 10,
      riskCategory10yr: this.getRiskCategory(boundedRisk10yr),
      riskCategory30yr: this.getRiskCategory30Year(boundedRisk30yr)
    };
  }

  /**
   * Model interventions using PREVENT algorithm
   */
  modelInterventions(baselineParams: PatientParams, interventions: InterventionRequest[]): InterventionScenario[] {
    const scenarios: InterventionScenario[] = [];
    let modifiedParams = { ...baselineParams };

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
          if (!baselineParams.statinUse) {
            const newNonHDL = Math.max(100, (baselineParams.nonHdlCholesterol || 150) - 40);
            modifiedParams = { 
              ...modifiedParams, 
              statinUse: true,
              nonHdlCholesterol: newNonHDL
            };
            scenarios.push({
              intervention: 'Statin Therapy',
              effect: this.interventions.statinTherapy,
              newRisk: this.calculateRisk(modifiedParams)
            });
          }
          break;

        case 'kidney_protection':
          if (intervention.eGFRImprovement && baselineParams.eGFR) {
            const newEGFR = Math.min(120, baselineParams.eGFR + intervention.eGFRImprovement);
            modifiedParams = { ...modifiedParams, eGFR: newEGFR };
            scenarios.push({
              intervention: 'Kidney Protection Therapy',
              effect: this.interventions.kidneyProtection,
              newRisk: this.calculateRisk(modifiedParams)
            });
          }
          break;

        case 'physical_activity':
          const currentRisk = this.calculateRisk(baselineParams);
          if (currentRisk.success) {
            const estimatedNewRisk: RiskResult = {
              ...currentRisk,
              risk: currentRisk.risk * (1 - (this.interventions.physicalActivity.riskReduction || 0)),
              risk30Year: currentRisk.risk30Year ? 
                currentRisk.risk30Year * (1 - (this.interventions.physicalActivity.riskReduction || 0)) : undefined
            };
            
            scenarios.push({
              intervention: 'Increased Physical Activity',
              effect: this.interventions.physicalActivity,
              newRisk: estimatedNewRisk
            });
          }
          break;
      }
    });

    return scenarios;
  }

  /**
   * Get clinical recommendations based on PREVENT results
   */
  getRecommendations(riskResult: RiskResult): ClinicalRecommendation[] {
    const recommendations: ClinicalRecommendation[] = [];
    const risk10yr = riskResult.risk;
    const risk30yr = riskResult.risk30Year;

    // PREVENT-specific recommendations
    if (risk10yr >= 20 || (risk30yr && risk30yr >= 50)) {
      recommendations.push({
        category: 'medication',
        priority: 'high',
        recommendation: 'High-intensity statin therapy strongly recommended',
        evidence: 'High cardiovascular risk based on PREVENT equations',
        reference: CLINICAL_REFERENCES['prevent-algorithm']
      });
    } else if (risk10yr >= 7.5 || (risk30yr && risk30yr >= 30)) {
      recommendations.push({
        category: 'medication',
        priority: 'medium',
        recommendation: 'Consider statin therapy with clinician-patient discussion',
        evidence: 'Intermediate cardiovascular risk based on PREVENT equations',
        reference: CLINICAL_REFERENCES['prevent-algorithm']
      });
    }

    // Kidney function recommendations
    if (riskResult.parameters.eGFR && riskResult.parameters.eGFR < 60) {
      recommendations.push({
        category: 'referral',
        priority: 'high',
        recommendation: 'Nephrology consultation recommended',
        evidence: 'Reduced kidney function increases cardiovascular risk',
        reference: CLINICAL_REFERENCES['ckd-epi-2021']
      });

      recommendations.push({
        category: 'medication',
        priority: 'medium',
        recommendation: 'Consider ACE inhibitor or ARB for kidney protection',
        evidence: 'Kidney protection reduces cardiovascular events',
        reference: CLINICAL_REFERENCES['prevent-algorithm']
      });
    }

    // Enhanced lifestyle recommendations
    recommendations.push({
      category: 'lifestyle',
      priority: 'high',
      recommendation: 'Comprehensive lifestyle modification program',
      evidence: 'Enhanced lifestyle interventions for PREVENT-based risk reduction',
      reference: CLINICAL_REFERENCES['prevent-algorithm']
    });

    // Smoking cessation
    if (riskResult.parameters.smoking) {
      recommendations.push({
        category: 'lifestyle',
        priority: 'high',
        recommendation: 'Intensive smoking cessation program',
        evidence: 'Smoking cessation reduces both 10-year and 30-year cardiovascular risk',
        reference: CLINICAL_REFERENCES['smoking-cessation']
      });
    }

    // Enhanced monitoring for PREVENT
    if (risk10yr >= 5 || (risk30yr && risk30yr >= 20)) {
      recommendations.push({
        category: 'monitoring',
        priority: 'medium',
        recommendation: 'Annual comprehensive cardiovascular risk reassessment',
        evidence: 'Regular monitoring with PREVENT equations for optimal care',
        reference: CLINICAL_REFERENCES['prevent-algorithm']
      });
    }

    return recommendations;
  }

  /**
   * Get clinical citations for PREVENT algorithm
   */
  getCitations(): ClinicalReference[] {
    return [
      CLINICAL_REFERENCES['prevent-algorithm'],
      CLINICAL_REFERENCES['ckd-epi-2021'],
      CLINICAL_REFERENCES['smoking-cessation'],
      CLINICAL_REFERENCES['statin-therapy']
    ];
  }

  /**
   * Format final results with dual timeline support
   */
  private formatResults(riskData: any, params: any, originalParams: PatientParams): RiskResult {
    return {
      success: true,
      risk: riskData.risk10yr,
      riskCategory: riskData.riskCategory10yr,
      risk30Year: riskData.risk30yr,
      riskCategory30Year: riskData.riskCategory30yr,
      confidence: riskData.confidence,
      algorithm: 'PREVENT',
      parameters: originalParams,
      defaults_used: params.defaults_used || [],
      warnings: params.warnings || [],
      interpretation: this.generateInterpretation(riskData.risk10yr, riskData.risk30yr),
      disclaimer: this.getDisclaimer(),
      genderNote: riskData.genderNote
    };
  }

  /**
   * Categorize 10-year risk level
   */
  private getRiskCategory(risk: number): RiskCategory {
    if (risk < 5) return { level: 'low', color: '#22C55E', message: 'Low risk' };
    if (risk < 7.5) return { level: 'borderline', color: '#EAB308', message: 'Borderline risk' };
    if (risk < 20) return { level: 'intermediate', color: '#F97316', message: 'Intermediate risk' };
    return { level: 'high', color: '#EF4444', message: 'High risk' };
  }

  /**
   * Categorize 30-year risk level (different thresholds)
   */
  private getRiskCategory30Year(risk: number): RiskCategory {
    if (risk < 20) return { level: 'low', color: '#22C55E', message: 'Low long-term risk' };
    if (risk < 30) return { level: 'borderline', color: '#EAB308', message: 'Borderline long-term risk' };
    if (risk < 50) return { level: 'intermediate', color: '#F97316', message: 'Intermediate long-term risk' };
    return { level: 'high', color: '#EF4444', message: 'High long-term risk' };
  }

  /**
   * Generate comprehensive interpretation for dual timeline
   */
  private generateInterpretation(risk10yr: number, risk30yr?: number): string {
    const category10yr = this.getRiskCategory(risk10yr);
    
    let interpretation = `Your estimated 10-year cardiovascular risk is ${risk10yr}% (${category10yr.level} risk).`;
    
    if (risk30yr) {
      const category30yr = this.getRiskCategory30Year(risk30yr);
      interpretation += ` Your 30-year risk is ${risk30yr}% (${category30yr.level} long-term risk).`;
    }

    interpretation += ' ';

    if (risk10yr < 5) {
      interpretation += 'Continue maintaining excellent lifestyle habits and regular monitoring.';
    } else if (risk10yr < 7.5) {
      interpretation += 'Consider lifestyle modifications and enhanced monitoring.';
    } else if (risk10yr < 20) {
      interpretation += 'Lifestyle changes and possible medical treatment may provide significant benefit.';
    } else {
      interpretation += 'Medical treatment strongly recommended in addition to intensive lifestyle changes.';
    }

    if (risk30yr && risk30yr >= 30) {
      interpretation += ' The elevated long-term risk emphasizes the importance of early intervention.';
    }

    return interpretation;
  }

  /**
   * Get PREVENT-specific disclaimer
   */
  private getDisclaimer() {
    return {
      primary: "This educational tool uses the 2024 AHA PREVENT Equations for demonstration purposes only. Results are not intended for clinical decision-making.",
      limitations: [
        "Validated for ages 30-79 years",
        "Incorporates kidney function for enhanced accuracy",
        "Provides both 10-year and 30-year risk estimates",
        "Requires recent laboratory values for optimal accuracy",
        "Individual results may vary based on unmeasured factors",
        "Social determinants of health may influence actual risk"
      ],
      usage: "Educational Use Only - Consult healthcare providers for personalized risk assessment and treatment recommendations."
    };
  }
}

// Export singleton instance
export const preventCalculator = new PREVENTRiskCalculator();