// Type definitions for Health Digital Twin application

export interface PatientParams {
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
  weight?: number; // lbs
  height?: number; // inches
}

export interface RiskCategory {
  level: 'low' | 'borderline' | 'intermediate' | 'high';
  color: string;
  message: string;
}

export interface RiskResult {
  success: boolean;
  risk: number;
  riskCategory: RiskCategory;
  confidence: 'standard' | 'lower';
  parameters: PatientParams;
  defaults_used: string[];
  warnings: string[];
  interpretation: string;
  disclaimer: {
    primary: string;
    limitations: string[];
    usage: string;
  };
  genderNote?: string;
  error?: string;
}

export interface InterventionEffect {
  riskReduction?: number;
  timeFrame: string;
  source: string;
  cholesterolReduction?: number;
  systolicBPReduction?: number;
  riskReductionPer10mmHg?: number;
  riskReductionPer5Percent?: number;
  maxReduction?: number;
}

export interface InterventionScenario {
  intervention: string;
  effect: InterventionEffect;
  newRisk: RiskResult;
}

export interface InterventionRequest {
  type: 'smoking_cessation' | 'blood_pressure_reduction' | 'statin_therapy' | 'physical_activity' | 'weight_loss';
  reduction?: number; // For BP reduction scenarios
  percentWeightLoss?: number; // For weight loss scenarios
}

export interface ValidationRange {
  min: number;
  max: number;
  required?: boolean;
  default?: number;
}

export interface ValidationRules {
  [key: string]: ValidationRange;
}

export interface FormStep {
  title: string;
  description: string;
  fields: string[];
  optional?: boolean;
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

// Analytics and Validation
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface ValidationMetrics {
  formCompletionRate: number;
  scenarioEngagementRate: number;
  emailSignupRate: number;
  sharingRate: number;
  averageTimeOnPage: number;
  bounceRate: number;
}

export interface UserFeedback {
  rating: number;
  comments?: string;
  wouldRecommend: boolean;
  timestamp: Date;
}