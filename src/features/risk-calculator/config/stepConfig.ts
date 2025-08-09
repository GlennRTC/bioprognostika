/**
 * Centralized Step Configuration
 * Defines step structure, metadata, and algorithm-specific behavior
 */

import { PatientParams } from '@/types';

export interface StepFieldConfig {
  key: keyof PatientParams;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  options?: readonly { value: string | number; label: string }[] | Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  help?: string;
  validation?: {
    min: number;
    max: number;
    errorMessage?: string;
  };
}

export interface StepConfig {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  algorithms: Array<'PCE' | 'PREVENT'>;
  fields: StepFieldConfig[];
  sections?: Array<{
    title: string;
    description?: string;
    fields: StepFieldConfig[];
    className?: string;
    icon?: string;
  }>;
}

/**
 * Common field configurations used across steps
 */
export const COMMON_FIELDS = {
  age: {
    key: 'age' as keyof PatientParams,
    label: 'Age',
    type: 'number' as const,
    required: true,
    min: 30,
    max: 79,
    placeholder: 'Enter your age',
    help: 'This calculator is validated for ages 40-79 years (PCE) or 30-79 years (PREVENT)',
    validation: { min: 30, max: 79 }
  },
  gender: {
    key: 'gender' as keyof PatientParams,
    label: 'Gender',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'non-binary', label: 'Non-binary / Other' },
    ],
    help: 'Biological sex assigned at birth for medical calculation purposes'
  },
  race: {
    key: 'race' as keyof PatientParams,
    label: 'Race / Ethnicity',
    type: 'select' as const,
    required: true,
    options: [
      { value: 'white', label: 'Non-Hispanic White' },
      { value: 'black', label: 'Non-Hispanic Black / African American' },
      { value: 'other', label: 'Other Race / Ethnicity' },
    ],
    help: 'Used for population-specific risk calculation accuracy'
  },
  systolicBP: {
    key: 'systolicBP' as keyof PatientParams,
    label: 'Systolic Blood Pressure',
    type: 'number' as const,
    required: true,
    min: 90,
    max: 200,
    placeholder: '120',
    help: 'Top number (mmHg)',
    validation: { min: 90, max: 200, errorMessage: 'Systolic blood pressure must be between 90-200 mmHg' }
  },
  diastolicBP: {
    key: 'diastolicBP' as keyof PatientParams,
    label: 'Diastolic Blood Pressure',
    type: 'number' as const,
    min: 60,
    max: 120,
    placeholder: '80',
    help: 'Bottom number (mmHg) - Optional',
    validation: { min: 60, max: 120, errorMessage: 'Diastolic blood pressure must be between 60-120 mmHg' }
  },
  totalCholesterol: {
    key: 'totalCholesterol' as keyof PatientParams,
    label: 'Total Cholesterol',
    type: 'number' as const,
    min: 130,
    max: 320,
    placeholder: '200',
    help: 'mg/dL - Leave blank if unknown',
    validation: { min: 130, max: 320 }
  },
  hdlCholesterol: {
    key: 'hdlCholesterol' as keyof PatientParams,
    label: 'HDL Cholesterol',
    type: 'number' as const,
    min: 20,
    max: 100,
    placeholder: '50',
    help: 'mg/dL - "Good" cholesterol',
    validation: { min: 20, max: 100 }
  },
  nonHdlCholesterol: {
    key: 'nonHdlCholesterol' as keyof PatientParams,
    label: 'Non-HDL Cholesterol',
    type: 'number' as const,
    min: 50,
    max: 400,
    placeholder: '150',
    help: 'mg/dL - Required for PREVENT algorithm',
    validation: { min: 50, max: 400 }
  }
} as const;

/**
 * Step configurations for different algorithms
 */
export const STEP_CONFIGS: Record<string, StepConfig[]> = {
  PCE: [
    {
      id: 1,
      title: 'Basic Information',
      subtitle: 'Step 1 of 3: Tell us about yourself',
      algorithms: ['PCE'],
      fields: [COMMON_FIELDS.age, COMMON_FIELDS.gender, COMMON_FIELDS.race]
    },
    {
      id: 2,
      title: 'Health Measurements',
      subtitle: 'Step 2 of 3: Your current health metrics',
      algorithms: ['PCE'],
      fields: [],
      sections: [
        {
          title: 'Blood Pressure (Required)',
          fields: [COMMON_FIELDS.systolicBP, COMMON_FIELDS.diastolicBP],
          className: 'bg-primary-50 p-4 rounded-xl border border-primary-200',
          icon: 'blood-pressure'
        },
        {
          title: 'Cholesterol Levels (Optional)',
          fields: [COMMON_FIELDS.totalCholesterol, COMMON_FIELDS.hdlCholesterol],
          className: 'bg-healing-sage/10 p-4 rounded-xl border border-healing-sage/30',
          icon: 'lab-results'
        }
      ]
    },
    {
      id: 3,
      title: 'Lifestyle Factors',
      subtitle: 'Step 3 of 3: Additional health information',
      algorithms: ['PCE'],
      fields: []
    }
  ],
  PREVENT: [
    {
      id: 1,
      title: 'Basic Information',
      subtitle: 'Step 1 of 4: Tell us about yourself',
      algorithms: ['PREVENT'],
      fields: [COMMON_FIELDS.age, COMMON_FIELDS.gender, COMMON_FIELDS.race]
    },
    {
      id: 2,
      title: 'Health Measurements',
      subtitle: 'Step 2 of 4: Your current health metrics',
      algorithms: ['PREVENT'],
      fields: [],
      sections: [
        {
          title: 'Blood Pressure (Required)',
          fields: [COMMON_FIELDS.systolicBP, COMMON_FIELDS.diastolicBP],
          className: 'bg-primary-50 p-4 rounded-xl border border-primary-200',
          icon: 'blood-pressure'
        },
        {
          title: 'Cholesterol Levels (Optional)',
          fields: [COMMON_FIELDS.totalCholesterol, COMMON_FIELDS.hdlCholesterol],
          className: 'bg-healing-sage/10 p-4 rounded-xl border border-healing-sage/30',
          icon: 'lab-results'
        }
      ]
    },
    {
      id: 3,
      title: 'Enhanced Laboratory Values',
      subtitle: 'Step 3 of 4: Advanced lab results for PREVENT algorithm',
      algorithms: ['PREVENT'],
      fields: [COMMON_FIELDS.nonHdlCholesterol]
    },
    {
      id: 4,
      title: 'Lifestyle & Social Factors',
      subtitle: 'Step 4 of 4: Complete health picture',
      algorithms: ['PREVENT'],
      fields: []
    }
  ]
};

/**
 * Get step configuration for a specific algorithm and step
 */
export function getStepConfig(algorithm: 'PCE' | 'PREVENT', stepNumber: number): StepConfig | null {
  const configs = STEP_CONFIGS[algorithm];
  return configs?.find(config => config.id === stepNumber) || null;
}

/**
 * Get total steps for an algorithm
 */
export function getTotalSteps(algorithm: 'PCE' | 'PREVENT'): number {
  return STEP_CONFIGS[algorithm]?.length || 0;
}

/**
 * Get step title for an algorithm and step number
 */
export function getStepTitle(algorithm: 'PCE' | 'PREVENT', stepNumber: number): string {
  const config = getStepConfig(algorithm, stepNumber);
  return config?.title || 'Unknown Step';
}

/**
 * Validate step inputs based on configuration
 */
export function validateStepInputs(
  algorithm: 'PCE' | 'PREVENT', 
  stepNumber: number, 
  formData: Partial<PatientParams>
): Record<string, string> {
  const config = getStepConfig(algorithm, stepNumber);
  if (!config) return {};

  const errors: Record<string, string> = {};

  // Get all fields from both direct fields and sections
  const allFields = [
    ...config.fields,
    ...(config.sections?.flatMap(section => section.fields) || [])
  ];

  allFields.forEach(field => {
    const value = formData[field.key];
    
    // Required field validation
    const isEmpty = value === undefined || value === null || 
      (typeof value === 'string' && value.trim() === '') ||
      (typeof value === 'number' && isNaN(value));
    
    if (field.required && isEmpty) {
      errors[field.key] = `${field.label} is required`;
      return;
    }

    // Skip further validation if field is empty and not required
    if (isEmpty && !field.required) return;

    // Numeric validation
    if (field.type === 'number' && field.validation && typeof value === 'number') {
      if (value < field.validation.min || value > field.validation.max) {
        errors[field.key] = field.validation.errorMessage || 
          `${field.label} must be between ${field.validation.min}-${field.validation.max}`;
      }
    }

    // Custom age validation based on algorithm
    if (field.key === 'age' && typeof value === 'number') {
      const minAge = algorithm === 'PCE' ? 40 : 30;
      if (value < minAge || value > 79) {
        errors[field.key] = `Age must be between ${minAge}-79 years for ${algorithm}`;
      }
    }

    // Cross-field validation for cholesterol
    if (field.key === 'hdlCholesterol' && formData.totalCholesterol && typeof value === 'number') {
      if (value > formData.totalCholesterol) {
        errors[field.key] = 'HDL cholesterol cannot be higher than total cholesterol';
      }
    }
  });

  return errors;
}