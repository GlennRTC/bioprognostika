import { useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PatientParams } from '@/types';
import { getCurrentAlgorithmInfo } from '../services';
import { getTotalSteps, getStepTitle, validateStepInputs } from '../config/stepConfig';

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

  const validateStep = useCallback((step: number): boolean => {
    const algorithm = formData.selectedAlgorithm || 'PREVENT';
    const stepErrors = validateStepInputs(algorithm, step, formData);
    
    // Handle PREVENT-specific validations that aren't in the base config
    if (algorithm === 'PREVENT' && step === 3) {
      // Non-HDL cholesterol validation for PREVENT - more flexible
      if (!formData.nonHdlCholesterol) {
        // Check if we can calculate it from total and HDL
        if (!(formData.totalCholesterol && formData.hdlCholesterol)) {
          stepErrors.nonHdlCholesterol = 'Non-HDL cholesterol is required for PREVENT algorithm';
        }
      }

      // Kidney function validation for PREVENT - more flexible
      if (!formData.eGFR && !formData.creatinine) {
        stepErrors.eGFR = 'Either eGFR or serum creatinine is required for PREVENT algorithm';
      }
      if (formData.eGFR && (formData.eGFR < 5 || formData.eGFR > 200)) {
        stepErrors.eGFR = 'eGFR must be between 5-200 mL/min/1.73m²';
      }
      if (formData.creatinine && (formData.creatinine < 0.1 || formData.creatinine > 15)) {
        stepErrors.creatinine = 'Serum creatinine must be between 0.1-15 mg/dL';
      }

      // Statin use validation for PREVENT
      if (formData.statinUse === undefined || formData.statinUse === null) {
        stepErrors.statinUse = 'Please specify if you are currently taking statin medication';
      }

      // Optional parameter validation - more lenient
      if (formData.hba1c && (formData.hba1c < 3 || formData.hba1c > 20)) {
        stepErrors.hba1c = 'HbA1c must be between 3-20%';
      }
      if (formData.albuminCreatinineRatio && (formData.albuminCreatinineRatio < 0 || formData.albuminCreatinineRatio > 5000)) {
        stepErrors.albuminCreatinineRatio = 'Albumin-creatinine ratio must be between 0-5000 mg/g';
      }
    }

    // Lifestyle validation for both algorithms
    if ((algorithm === 'PCE' && step === 3) || (algorithm === 'PREVENT' && step === 4)) {
      if (formData.weight && (formData.weight < 50 || formData.weight > 500)) {
        stepErrors.weight = 'Weight must be between 50-500 lbs';
      }
      if (formData.height && (formData.height < 36 || formData.height > 96)) {
        stepErrors.height = 'Height must be between 36-96 inches';
      }
      if (formData.socialDeprivationIndex && (formData.socialDeprivationIndex < 0 || formData.socialDeprivationIndex > 100)) {
        stepErrors.socialDeprivationIndex = 'Social deprivation index must be between 0-100';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [formData]);

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

  const getStepCount = useCallback((): number => {
    return getTotalSteps(formData.selectedAlgorithm || 'PREVENT');
  }, [formData.selectedAlgorithm]);

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

  const getStepTitleForAlgorithm = useCallback((step: number): string => {
    return getStepTitle(formData.selectedAlgorithm || 'PREVENT', step);
  }, [formData.selectedAlgorithm]);

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
    getStepTitle: getStepTitleForAlgorithm,
  };
}