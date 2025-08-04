import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PatientParams } from '@/types';
import { getCurrentAlgorithmInfo } from '../services';

interface FormState extends Partial<PatientParams> {
  currentStep: number;
  completedSteps: number[];
  selectedAlgorithm: 'PCE' | 'PREVENT';
}

const initialFormState: FormState = {
  currentStep: 1,
  completedSteps: [],
  selectedAlgorithm: 'PREVENT', // Default to PREVENT (latest algorithm)
  
  // Demographics (Required for both algorithms)
  age: undefined,
  gender: undefined,
  race: undefined,
  
  // Blood Pressure (Required for both)
  systolicBP: undefined,
  diastolicBP: undefined,
  bpMedication: false,
  
  // Cholesterol (Enhanced for PREVENT)
  totalCholesterol: undefined,
  hdlCholesterol: undefined,
  nonHdlCholesterol: undefined, // NEW: Required for PREVENT
  
  // Medical Conditions
  diabetes: false,
  smoking: false,
  statinUse: undefined, // NEW: Required for PREVENT
  
  // Kidney Function (NEW: Required for PREVENT)
  eGFR: undefined,
  creatinine: undefined,
  albuminCreatinineRatio: undefined,
  
  // Enhanced Optional Parameters
  hba1c: undefined,
  socialDeprivationIndex: undefined,
  
  // Physical Measurements
  weight: undefined,
  height: undefined,
};

export function useFormState() {
  const [formData, setFormData] = useLocalStorage<FormState>('bioprognostika_formData', initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Force initialization if selectedAlgorithm is missing
  if (!formData.selectedAlgorithm) {
    setFormData(prev => ({
      ...prev,
      selectedAlgorithm: 'PCE'
    }));
  }

  const updateField = (field: keyof PatientParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateStep = (step: number) => {
    setFormData(prev => ({
      ...prev,
      currentStep: step
    }));
  };

  const markStepCompleted = (step: number) => {
    setFormData(prev => ({
      ...prev,
      completedSteps: [...new Set([...prev.completedSteps, step])]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    const algorithm = formData.selectedAlgorithm;
    const algorithmInfo = getCurrentAlgorithmInfo();

    switch (step) {
      case 1: // Basic Demographics
        // Age validation - different ranges for PCE vs PREVENT
        const minAge = algorithm === 'PCE' ? 40 : 30;
        const maxAge = 79;
        if (!formData.age || formData.age < minAge || formData.age > maxAge) {
          newErrors.age = `Age must be between ${minAge}-${maxAge} years for ${algorithm}`;
        }
        if (!formData.gender) {
          newErrors.gender = 'Please select your gender';
        }
        if (!formData.race) {
          newErrors.race = 'Please select your race/ethnicity';
        }
        break;

      case 2: // Health Measurements (Blood Pressure & Basic Labs)
        if (!formData.systolicBP || formData.systolicBP < 90 || formData.systolicBP > 200) {
          newErrors.systolicBP = 'Systolic blood pressure must be between 90-200 mmHg';
        }
        if (formData.diastolicBP && (formData.diastolicBP < 60 || formData.diastolicBP > 120)) {
          newErrors.diastolicBP = 'Diastolic blood pressure must be between 60-120 mmHg';
        }
        
        // Basic cholesterol validation
        if (formData.totalCholesterol && (formData.totalCholesterol < 130 || formData.totalCholesterol > 320)) {
          newErrors.totalCholesterol = 'Total cholesterol must be between 130-320 mg/dL';
        }
        if (formData.hdlCholesterol && (formData.hdlCholesterol < 20 || formData.hdlCholesterol > 100)) {
          newErrors.hdlCholesterol = 'HDL cholesterol must be between 20-100 mg/dL';
        }
        if (formData.hdlCholesterol && formData.totalCholesterol && 
            formData.hdlCholesterol > formData.totalCholesterol) {
          newErrors.hdlCholesterol = 'HDL cholesterol cannot be higher than total cholesterol';
        }
        break;

      case 3: // Enhanced Labs (PREVENT-specific) or Lifestyle (PCE)
        if (algorithm === 'PREVENT') {
          // Non-HDL cholesterol validation for PREVENT - more flexible
          if (!formData.nonHdlCholesterol) {
            // Check if we can calculate it from total and HDL
            if (formData.totalCholesterol && formData.hdlCholesterol) {
              // Auto-calculate and don't error
            } else {
              newErrors.nonHdlCholesterol = 'Non-HDL cholesterol is required for PREVENT algorithm';
            }
          }
          if (formData.nonHdlCholesterol && (formData.nonHdlCholesterol < 50 || formData.nonHdlCholesterol > 400)) {
            newErrors.nonHdlCholesterol = 'Non-HDL cholesterol must be between 50-400 mg/dL';
          }

          // Kidney function validation for PREVENT - more flexible
          if (!formData.eGFR && !formData.creatinine) {
            newErrors.eGFR = 'Either eGFR or serum creatinine is required for PREVENT algorithm';
          }
          if (formData.eGFR && (formData.eGFR < 5 || formData.eGFR > 200)) {
            newErrors.eGFR = 'eGFR must be between 5-200 mL/min/1.73m²';
          }
          if (formData.creatinine && (formData.creatinine < 0.1 || formData.creatinine > 15)) {
            newErrors.creatinine = 'Serum creatinine must be between 0.1-15 mg/dL';
          }

          // Statin use validation for PREVENT
          if (formData.statinUse === undefined || formData.statinUse === null) {
            newErrors.statinUse = 'Please specify if you are currently taking statin medication';
          }

          // Optional parameter validation - more lenient
          if (formData.hba1c && (formData.hba1c < 3 || formData.hba1c > 20)) {
            newErrors.hba1c = 'HbA1c must be between 3-20%';
          }
          if (formData.albuminCreatinineRatio && (formData.albuminCreatinineRatio < 0 || formData.albuminCreatinineRatio > 5000)) {
            newErrors.albuminCreatinineRatio = 'Albumin-creatinine ratio must be between 0-5000 mg/g';
          }
        } else {
          // PCE Step 3 is lifestyle factors - no strict requirements
          // Basic lifestyle validation for PCE
          if (formData.weight && (formData.weight < 50 || formData.weight > 500)) {
            newErrors.weight = 'Weight must be between 50-500 lbs';
          }
          if (formData.height && (formData.height < 48 || formData.height > 84)) {
            newErrors.height = 'Height must be between 48-84 inches';
          }
        }
        break;

      case 4: // Lifestyle Factors - Enhanced validation
        // Optional lifestyle validations
        if (formData.weight && (formData.weight < 50 || formData.weight > 500)) {
          newErrors.weight = 'Weight must be between 50-500 lbs';
        }
        if (formData.height && (formData.height < 36 || formData.height > 96)) {
          newErrors.height = 'Height must be between 36-96 inches';
        }
        if (formData.socialDeprivationIndex && (formData.socialDeprivationIndex < 0 || formData.socialDeprivationIndex > 100)) {
          newErrors.socialDeprivationIndex = 'Social deprivation index must be between 0-100';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const switchAlgorithm = (algorithm: 'PCE' | 'PREVENT') => {
    
    // Create a new form state with the algorithm change and reset to step 1
    const newFormState: FormState = {
      ...initialFormState,
      selectedAlgorithm: algorithm,
      currentStep: 1,
      completedSteps: [],
      // Preserve basic demographics if they exist
      age: formData.age,
      gender: formData.gender,
      race: formData.race,
    };
    
    setFormData(newFormState);
    setErrors({});
  };

  const getStepCount = (): number => {
    // Dynamic step count based on selected algorithm
    return formData.selectedAlgorithm === 'PREVENT' ? 4 : 3;
  };

  const getPatientParams = (): PatientParams => {
    return {
      // Demographics
      age: formData.age!,
      gender: formData.gender!,
      race: formData.race!,
      
      // Blood Pressure
      systolicBP: formData.systolicBP!,
      diastolicBP: formData.diastolicBP,
      bpMedication: formData.bpMedication || false,
      
      // Cholesterol
      totalCholesterol: formData.totalCholesterol,
      hdlCholesterol: formData.hdlCholesterol,
      nonHdlCholesterol: formData.nonHdlCholesterol,
      
      // Medical Conditions
      diabetes: formData.diabetes || false,
      smoking: formData.smoking || false,
      statinUse: formData.statinUse,
      
      // Kidney Function
      eGFR: formData.eGFR,
      creatinine: formData.creatinine,
      albuminCreatinineRatio: formData.albuminCreatinineRatio,
      
      // Enhanced Parameters
      hba1c: formData.hba1c,
      socialDeprivationIndex: formData.socialDeprivationIndex,
      
      // Physical Measurements
      weight: formData.weight,
      height: formData.height,
    };
  };

  const isStepRequired = (step: number): boolean => {
    if (formData.selectedAlgorithm === 'PCE') {
      return step <= 3; // PCE only needs 3 steps
    }
    return step <= 4; // PREVENT needs all 4 steps
  };

  const getStepTitle = (step: number): string => {
    const titles = {
      1: 'Demographics',
      2: 'Health Measurements',
      3: formData.selectedAlgorithm === 'PREVENT' ? 'Enhanced Laboratory Values' : 'Lifestyle Factors',
      4: 'Lifestyle & Social Factors'
    };
    return titles[step as keyof typeof titles] || 'Unknown Step';
  };

  return {
    formData,
    errors,
    updateField,
    updateStep,
    markStepCompleted,
    validateStep,
    resetForm,
    getPatientParams,
    switchAlgorithm,
    getStepCount,
    isStepRequired,
    getStepTitle,
  };
}