import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PatientParams } from '@/types';

interface FormState extends Partial<PatientParams> {
  currentStep: number;
  completedSteps: number[];
}

const initialFormState: FormState = {
  currentStep: 1,
  completedSteps: [],
  // Required fields will be filled as user progresses
  age: undefined,
  gender: undefined,
  race: undefined,
  systolicBP: undefined,
  // Optional fields with defaults handled by PCE algorithm
  diastolicBP: undefined,
  totalCholesterol: undefined,
  hdlCholesterol: undefined,
  diabetes: false,
  smoking: false,
  bpMedication: false,
  weight: undefined,
  height: undefined,
};

export function useFormState() {
  const [formData, setFormData] = useLocalStorage<FormState>('bioprognostika_formData', initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    switch (step) {
      case 1: // Basic Demographics
        if (!formData.age || formData.age < 40 || formData.age > 79) {
          newErrors.age = 'Age must be between 40-79 years';
        }
        if (!formData.gender) {
          newErrors.gender = 'Please select your gender';
        }
        if (!formData.race) {
          newErrors.race = 'Please select your race/ethnicity';
        }
        break;

      case 2: // Health Measurements
        if (!formData.systolicBP || formData.systolicBP < 90 || formData.systolicBP > 200) {
          newErrors.systolicBP = 'Systolic blood pressure must be between 90-200 mmHg';
        }
        if (formData.diastolicBP && (formData.diastolicBP < 60 || formData.diastolicBP > 120)) {
          newErrors.diastolicBP = 'Diastolic blood pressure must be between 60-120 mmHg';
        }
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

      case 3: // Lifestyle Factors - All optional, no validation needed
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const getPatientParams = (): PatientParams => {
    return {
      age: formData.age!,
      gender: formData.gender!,
      race: formData.race!,
      systolicBP: formData.systolicBP!,
      diastolicBP: formData.diastolicBP,
      totalCholesterol: formData.totalCholesterol,
      hdlCholesterol: formData.hdlCholesterol,
      diabetes: formData.diabetes || false,
      smoking: formData.smoking || false,
      bpMedication: formData.bpMedication || false,
      weight: formData.weight,
      height: formData.height,
    };
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
  };
}