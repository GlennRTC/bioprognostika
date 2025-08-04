/**
 * Clinical Utility Functions
 * Supporting calculations and validations for cardiovascular risk assessment
 * 
 * Educational Research Tool - Not for Clinical Use
 * Implements CKD-EPI eGFR calculations and clinical parameter validation
 */

import { PatientParams, ClinicalReference } from '@/types';

/**
 * Calculate eGFR using CKD-EPI 2021 equation (without race)
 * Reference: NEJM 2021;385:1737-1749
 */
export function calculateEGFR(params: {
  creatinine: number; // mg/dL
  age: number;
  gender: 'male' | 'female' | 'non-binary';
}): number {
  const { creatinine, age, gender } = params;
  
  // CKD-EPI 2021 coefficients (race-free)
  const isFemale = gender === 'female';
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const genderMultiplier = isFemale ? 1.012 : 1.0;
  
  // Calculate eGFR
  const creatinineRatio = creatinine / kappa;
  const minTerm = Math.min(creatinineRatio, 1);
  const maxTerm = Math.max(creatinineRatio, 1);
  
  const eGFR = 142 * 
    Math.pow(minTerm, alpha) * 
    Math.pow(maxTerm, -1.200) * 
    Math.pow(0.9938, age) * 
    genderMultiplier;
  
  // Handle non-binary gender (average approach)
  if (gender === 'non-binary') {
    const maleEGFR = calculateEGFR({ creatinine, age, gender: 'male' });
    const femaleEGFR = calculateEGFR({ creatinine, age, gender: 'female' });
    return (maleEGFR + femaleEGFR) / 2;
  }
  
  return Math.round(eGFR * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate non-HDL cholesterol
 */
export function calculateNonHDL(totalCholesterol: number, hdlCholesterol: number): number {
  return totalCholesterol - hdlCholesterol;
}

/**
 * Calculate BMI from weight and height
 */
export function calculateBMI(weightLbs: number, heightInches: number): number {
  // Convert to metric: BMI = weight(kg) / height(m)²
  const weightKg = weightLbs * 0.453592;
  const heightM = heightInches * 0.0254;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Validate kidney function parameters
 */
export function validateKidneyFunction(params: PatientParams): {
  isValid: boolean;
  warnings: string[];
  calculations: {
    eGFR?: number;
    ckdStage?: string;
  };
} {
  const warnings: string[] = [];
  const calculations: { eGFR?: number; ckdStage?: string } = {};
  
  // Calculate eGFR if creatinine is provided but eGFR is not
  if (params.creatinine && !params.eGFR && params.age && params.gender) {
    try {
      calculations.eGFR = calculateEGFR({
        creatinine: params.creatinine,
        age: params.age,
        gender: params.gender
      });
    } catch (error) {
      warnings.push('Unable to calculate eGFR from creatinine');
    }
  }
  
  // Use provided eGFR or calculated value
  const eGFR = params.eGFR || calculations.eGFR;
  
  if (eGFR) {
    // Determine CKD stage
    calculations.ckdStage = getCKDStage(eGFR);
    
    // Add warnings for kidney function
    if (eGFR < 60) {
      warnings.push(`Reduced kidney function detected (eGFR: ${eGFR}). Consider nephrology consultation.`);
    }
    
    if (eGFR < 30) {
      warnings.push('Severely reduced kidney function. Cardiovascular risk significantly increased.');
    }
    
    // Validate albuminuria if provided
    if (params.albuminCreatinineRatio) {
      if (params.albuminCreatinineRatio > 30) {
        warnings.push('Elevated albumin-creatinine ratio indicates kidney damage.');
      }
      if (params.albuminCreatinineRatio > 300) {
        warnings.push('Severely elevated albumin-creatinine ratio. Requires immediate attention.');
      }
    }
  }
  
  return {
    isValid: warnings.length === 0 || warnings.every(w => !w.includes('severely') && !w.includes('immediate')),
    warnings,
    calculations
  };
}

/**
 * Get CKD stage from eGFR
 */
export function getCKDStage(eGFR: number): string {
  if (eGFR >= 90) return 'G1 (Normal/High)';
  if (eGFR >= 60) return 'G2 (Mild decrease)';
  if (eGFR >= 45) return 'G3a (Mild-moderate decrease)';
  if (eGFR >= 30) return 'G3b (Moderate-severe decrease)';
  if (eGFR >= 15) return 'G4 (Severe decrease)';
  return 'G5 (Kidney failure)';
}

/**
 * Validate cholesterol parameters
 */
export function validateCholesterol(params: PatientParams): {
  isValid: boolean;
  warnings: string[];
  calculations: {
    nonHdlCholesterol?: number;
    ldlEstimate?: number;
  };
} {
  const warnings: string[] = [];
  const calculations: { nonHdlCholesterol?: number; ldlEstimate?: number } = {};
  
  // Calculate non-HDL if both total and HDL are provided
  if (params.totalCholesterol && params.hdlCholesterol) {
    calculations.nonHdlCholesterol = calculateNonHDL(params.totalCholesterol, params.hdlCholesterol);
  }
  
  // Use provided non-HDL or calculated value
  const nonHdl = params.nonHdlCholesterol || calculations.nonHdlCholesterol;
  
  // Validate cholesterol values
  if (params.totalCholesterol) {
    if (params.totalCholesterol > 240) {
      warnings.push('Elevated total cholesterol (>240 mg/dL). Consider lipid management.');
    }
  }
  
  if (params.hdlCholesterol) {
    if (params.hdlCholesterol < 40) {
      warnings.push('Low HDL cholesterol (<40 mg/dL). Consider lifestyle interventions.');
    }
  }
  
  if (nonHdl) {
    if (nonHdl > 190) {
      warnings.push('Very high non-HDL cholesterol (>190 mg/dL). Consider statin therapy.');
    } else if (nonHdl > 160) {
      warnings.push('High non-HDL cholesterol (>160 mg/dL). Review lipid management.');
    }
  }
  
  // Estimate LDL (Friedewald equation approximation)
  if (params.totalCholesterol && params.hdlCholesterol && params.totalCholesterol < 400) {
    // Simplified estimate (assumes triglycerides ~150 mg/dL if not provided)
    calculations.ldlEstimate = params.totalCholesterol - params.hdlCholesterol - 30;
  }
  
  return {
    isValid: true, // Cholesterol warnings don't invalidate calculation
    warnings,
    calculations
  };
}

/**
 * Validate diabetes parameters
 */
export function validateDiabetes(params: PatientParams): {
  isValid: boolean;
  warnings: string[];
  diabetesStatus: 'none' | 'prediabetes' | 'diabetes' | 'uncontrolled';
} {
  const warnings: string[] = [];
  let diabetesStatus: 'none' | 'prediabetes' | 'diabetes' | 'uncontrolled' = 'none';
  
  if (params.hba1c) {
    if (params.hba1c >= 6.5) {
      diabetesStatus = 'diabetes';
      if (params.hba1c >= 9.0) {
        diabetesStatus = 'uncontrolled';
        warnings.push('Poorly controlled diabetes (HbA1c ≥9%). Intensive diabetes management needed.');
      } else if (params.hba1c >= 7.0) {
        warnings.push('Diabetes present but may need better control. Target HbA1c <7% for most patients.');
      }
    } else if (params.hba1c >= 5.7) {
      diabetesStatus = 'prediabetes';
      warnings.push('Prediabetes detected (HbA1c 5.7-6.4%). Consider diabetes prevention strategies.');
    }
  } else if (params.diabetes) {
    diabetesStatus = 'diabetes';
    warnings.push('Diabetes history noted. Recent HbA1c recommended for risk assessment.');
  }
  
  return {
    isValid: true, // Diabetes status doesn't invalidate calculation
    warnings,
    diabetesStatus
  };
}

/**
 * Clinical reference database
 */
export const CLINICAL_REFERENCES: Record<string, ClinicalReference> = {
  'ckd-epi-2021': {
    id: 'ckd-epi-2021',
    authors: 'Inker LA, Eneanya ND, Coresh J, et al.',
    title: 'New Creatinine- and Cystatin C–Based Equations to Estimate GFR without Race',
    journal: 'New England Journal of Medicine',
    year: 2021,
    pmid: '34554658',
    doi: '10.1056/NEJMoa2102953',
    summary: 'Updated CKD-EPI equation removing race coefficient for more equitable eGFR estimation.'
  },
  
  'prevent-algorithm': {
    id: 'prevent-algorithm',
    authors: 'Khan SS, Matsushita K, Sang Y, et al.',
    title: 'Development and Validation of the American Heart Association\'s PREVENT Equations',
    journal: 'Circulation',
    year: 2024,
    pmid: '37947085', // Actual PMID for PREVENT publication
    doi: '10.1161/CIRCULATIONAHA.123.067626',
    summary: 'PREVENT equations for 10- and 30-year cardiovascular risk prediction including kidney function and enhanced demographic representation.'
  },
  
  'pce-2013': {
    id: 'pce-2013',
    authors: 'Goff DC Jr, Lloyd-Jones DM, Bennett G, et al.',
    title: '2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk',
    journal: 'Circulation',
    year: 2014,
    pmid: '24222017',
    doi: '10.1161/01.cir.0000437741.48606.98',
    summary: 'Original Pooled Cohort Equations for 10-year ASCVD risk estimation.'
  },
  
  'smoking-cessation': {
    id: 'smoking-cessation',
    authors: 'Critchley JA, Capewell S',
    title: 'Mortality risk reduction associated with smoking cessation in patients with coronary heart disease',
    journal: 'JAMA',
    year: 2003,
    pmid: '12865374',
    doi: '10.1001/jama.290.1.86',
    summary: 'Systematic review showing 36% mortality reduction with smoking cessation.'
  },
  
  'statin-therapy': {
    id: 'statin-therapy',
    authors: 'Cholesterol Treatment Trialists Collaboration',
    title: 'Efficacy and safety of more intensive lowering of LDL cholesterol',
    journal: 'Lancet',
    year: 2010,
    pmid: '21067804',
    doi: '10.1016/S0140-6736(10)61350-5',
    summary: 'Meta-analysis demonstrating LDL cholesterol reduction benefits for cardiovascular outcomes.'
  },

  'social-determinants-health': {
    id: 'social-determinants-health',
    authors: 'Havranek EP, Mujahid MS, Barr DA, et al.',
    title: 'Social Determinants of Risk and Outcomes for Cardiovascular Disease',
    journal: 'Circulation',
    year: 2015,
    pmid: '26199086',
    doi: '10.1161/CIR.0000000000000228',
    summary: 'AHA Scientific Statement on how social factors impact cardiovascular health and outcomes.'
  },

  'area-deprivation-index': {
    id: 'area-deprivation-index',
    authors: 'Kind AJH, Buckingham WR',
    title: 'Making Neighborhood-Disadvantage Metrics Accessible',
    journal: 'New England Journal of Medicine',
    year: 2018,
    pmid: '29562145',
    doi: '10.1056/NEJMp1802313',
    summary: 'Review of area-based socioeconomic measures including Area Deprivation Index for clinical use.'
  },

  'social-deprivation-cvd': {
    id: 'social-deprivation-cvd',
    authors: 'Churchwell K, Elkind MSV, Benjamin RM, et al.',
    title: 'Call to Action: Structural Racism as a Fundamental Driver of Health Disparities',
    journal: 'Circulation',
    year: 2020,
    pmid: '33170755',
    doi: '10.1161/CIR.0000000000000936',
    summary: 'AHA Presidential Advisory addressing structural racism and social determinants in cardiovascular health.'
  }
};

/**
 * Get clinical reference by ID
 */
export function getClinicalReference(id: string): ClinicalReference | undefined {
  return CLINICAL_REFERENCES[id];
}

/**
 * Format clinical reference for display
 */
export function formatCitation(reference: ClinicalReference): string {
  return `${reference.authors} ${reference.title}. ${reference.journal}. ${reference.year}.`;
}

/**
 * Generate PubMed URL
 */
export function getPubMedUrl(pmid: string): string {
  return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
}

/**
 * Generate DOI URL
 */
export function getDoiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}