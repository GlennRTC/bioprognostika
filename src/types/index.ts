// Type definitions for Health Digital Twin application

// Enhanced patient parameters for PREVENT algorithm
export interface PatientParams {
  // Demographics (Required)
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  race: 'white' | 'black' | 'other';
  
  // Blood Pressure (Required)
  systolicBP: number;
  diastolicBP?: number;
  bpMedication?: boolean;
  
  // Cholesterol (Enhanced for PREVENT)
  totalCholesterol?: number;
  hdlCholesterol?: number;
  nonHdlCholesterol?: number; // NEW: Required for PREVENT
  
  // Medical Conditions
  diabetes?: boolean;
  smoking?: boolean;
  statinUse?: boolean; // NEW: Required for PREVENT
  
  // Kidney Function (NEW: Required for PREVENT)
  eGFR?: number; // Estimated Glomerular Filtration Rate
  creatinine?: number; // For eGFR calculation if not provided
  albuminCreatinineRatio?: number; // Optional enhancement
  
  // Enhanced Optional Parameters
  hba1c?: number; // Hemoglobin A1c for diabetes management
  socialDeprivationIndex?: number; // Social determinants of health
  
  // Physical Measurements
  weight?: number; // lbs
  height?: number; // inches
}

// PCE-specific subset for backward compatibility
export interface PCEPatientParams {
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  race: 'white' | 'black' | 'other';
  systolicBP: number;
  diastolicBP?: number;
  totalCholesterol?: number;
  hdlCholesterol?: number;
  diabetes?: boolean;
  smoking?: boolean;
  bpMedication?: boolean;
  weight?: number;
  height?: number;
}

export interface RiskCategory {
  level: 'low' | 'borderline' | 'intermediate' | 'high';
  color: string;
  message: string;
}

// Enhanced risk result supporting dual timelines
export interface RiskResult {
  success: boolean;
  
  // Primary risk (10-year for PCE, dual for PREVENT)
  risk: number;
  riskCategory: RiskCategory;
  
  // PREVENT dual timeline results
  risk30Year?: number;
  riskCategory30Year?: RiskCategory;
  
  // Metadata
  confidence: 'standard' | 'lower';
  algorithm: 'PCE' | 'PREVENT';
  parameters: PatientParams;
  defaults_used: string[];
  warnings: string[];
  interpretation: string;
  
  // Clinical context
  disclaimer: {
    primary: string;
    limitations: string[];
    usage: string;
  };
  genderNote?: string;
  
  // Risk comparison (for algorithm transition)
  comparisonResults?: RiskComparisonResult;
  
  error?: string;
}

// Risk comparison between algorithms
export interface RiskComparisonResult {
  pceRisk?: number;
  preventRisk?: number;
  riskDifference?: number;
  reclassificationFlag?: 'up' | 'down' | 'none';
  clinicalSignificance?: string;
}

// Clinical citation system
export interface ClinicalReference {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  pmid?: string;
  doi?: string;
  url?: string;
  summary?: string;
}

export interface InterventionEffect {
  riskReduction?: number;
  timeFrame: string;
  source: string;
  reference?: ClinicalReference;
  cholesterolReduction?: number;
  systolicBPReduction?: number;
  riskReductionPer10mmHg?: number;
  riskReductionPer5Percent?: number;
  maxReduction?: number;
  
  // Enhanced for PREVENT
  eGFRImprovement?: number;
  kidneyProtection?: boolean;
}

export interface InterventionScenario {
  intervention: string;
  effect: InterventionEffect;
  newRisk: RiskResult;
}

export interface InterventionRequest {
  type: 'smoking_cessation' | 'blood_pressure_reduction' | 'statin_therapy' | 'physical_activity' | 'weight_loss' | 'kidney_protection';
  reduction?: number; // For BP reduction scenarios
  percentWeightLoss?: number; // For weight loss scenarios
  eGFRImprovement?: number; // For kidney function improvement
}

// Algorithm interface for abstraction
export interface RiskCalculatorAlgorithm {
  readonly name: string;
  readonly version: string;
  readonly ageRange: { min: number; max: number };
  readonly requiredParameters: (keyof PatientParams)[];
  readonly optionalParameters: (keyof PatientParams)[];
  
  calculateRisk(params: PatientParams): RiskResult;
  modelInterventions(baselineParams: PatientParams, interventions: InterventionRequest[]): InterventionScenario[];
  validateInputs(params: PatientParams): { isValid: boolean; errors: string[]; warnings: string[] };
  
  // Clinical decision support
  getRecommendations(riskResult: RiskResult): ClinicalRecommendation[];
  getCitations(): ClinicalReference[];
}

// Clinical decision support
export interface ClinicalRecommendation {
  category: 'lifestyle' | 'medication' | 'monitoring' | 'referral';
  priority: 'high' | 'medium' | 'low';
  recommendation: string;
  evidence: string;
  reference?: ClinicalReference;
}

// Algorithm configuration
export interface AlgorithmConfig {
  algorithm: 'PCE' | 'PREVENT';
  enableComparison: boolean;
  showCitations: boolean;
  enableInterventions: boolean;
}

// UI Component Props
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export interface InputProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'email' | 'select';
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  help?: string;
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'medical';
  className?: string;
}

