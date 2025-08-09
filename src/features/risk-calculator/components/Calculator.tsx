import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Disclaimer, AlgorithmToggle } from '@/components/ui';
import AlgorithmInfoBanner from '@/components/ui/AlgorithmInfoBanner';
import StreamlinedFooter from '@/components/ui/StreamlinedFooter';
import { useFormState } from '../hooks/useFormState';
import { configuredRiskCalculator, switchToAlgorithm, enableAlgorithmComparison } from '../services';
import StepIndicator from './StepIndicator';
import Step1Demographics from './Step1Demographics';
import Step2HealthMeasurements from './Step2HealthMeasurements';
import Step3LifestyleFactors from './Step3LifestyleFactors';
import Step3EnhancedLabs from './Step3EnhancedLabs';
import Step4LifestyleSocial from './Step4LifestyleSocial';

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const [isCalculating, setIsCalculating] = useState(false);
  const {
    formData,
    errors,
    updateField,
    updateStep,
    markStepCompleted,
    validateStep,
    getPatientParams,
    switchAlgorithm,
    getStepCount,
    getStepTitle,
  } = useFormState();

  const totalSteps = getStepCount();
  const stepTitles = Array.from({ length: totalSteps }, (_, i) => getStepTitle(i + 1));

  const handleNext = () => {
    if (validateStep(formData.currentStep)) {
      markStepCompleted(formData.currentStep);
      
      if (formData.currentStep < totalSteps) {
        updateStep(formData.currentStep + 1);
      } else {
        // Final step - calculate risk and navigate to results
        handleCalculateRisk();
      }
    }
  };

  const handlePrevious = () => {
    if (formData.currentStep > 1) {
      updateStep(formData.currentStep - 1);
    }
  };

  const handleCalculateRisk = async () => {
    setIsCalculating(true);
    
    try {
      const patientParams = getPatientParams();
      // Configure the algorithm
      switchToAlgorithm(formData.selectedAlgorithm || 'PREVENT');
      enableAlgorithmComparison(true); // Enable comparison for educational purposes
      
      // Calculate risk with the configured algorithm
      const result = await configuredRiskCalculator.calculateRisk(patientParams);
      
      if (!result || !result.hasOwnProperty('success')) {
        throw new Error('Invalid result returned from calculator');
      }
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
      // Store result and algorithm info in localStorage for Results page
      const resultData = {
        riskResult: result,
        algorithmUsed: formData.selectedAlgorithm || 'PREVENT',
        timestamp: new Date().toISOString(),
        patientParams
      };
      
      localStorage.setItem('bioprognostika_riskResult', JSON.stringify(resultData));
      
      // Navigate to results
      navigate('/results');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`There was an error calculating your risk: ${errorMessage}. Please check your inputs and try again.`);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAlgorithmSwitch = (algorithm: 'PCE' | 'PREVENT') => {
    switchAlgorithm(algorithm);
  };

  const isFirstStep = formData.currentStep === 1;
  const isLastStep = formData.currentStep === totalSteps;
  const hasErrors = Object.keys(errors).length > 0;

  const renderCurrentStep = () => {
    const currentAlgorithm = formData.selectedAlgorithm || 'PCE';
    
    switch (formData.currentStep) {
      case 1:
        return (
          <Step1Demographics
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        );
      case 2:
        return (
          <Step2HealthMeasurements
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        );
      case 3:
        // For PREVENT: Enhanced Labs; For PCE: Lifestyle Factors
        if (currentAlgorithm === 'PREVENT') {
          return (
            <Step3EnhancedLabs
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
          );
        } else {
          return (
            <Step3LifestyleFactors
              formData={formData}
              errors={errors}
              updateField={updateField}
            />
          );
        }
      case 4:
        // Only for PREVENT: Lifestyle & Social Factors
        return (
          <Step4LifestyleSocial
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-healing-mint/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="mobile-nav-header">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Bioprognostika Health Prediction
              </h1>
              <p className="text-prediction-600 mt-1 font-medium">
                Step {formData.currentStep} of {totalSteps} • ~{Math.max(1, totalSteps + 1 - formData.currentStep)} minutes remaining • Using {formData.selectedAlgorithm || 'PREVENT'} Algorithm
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Algorithm Selector */}
              <AlgorithmToggle
                selectedAlgorithm={formData.selectedAlgorithm || 'PCE'}
                onAlgorithmChange={handleAlgorithmSwitch}
                disabled={isCalculating}
              />
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </Button>
            </div>
          </div>
          
          {/* Algorithm Info - Simplified */}
          <div className="mt-4">
            <AlgorithmInfoBanner 
              algorithm={formData.selectedAlgorithm || 'PCE'}
              currentStep={formData.currentStep}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Step Indicator */}
          <StepIndicator
            currentStep={formData.currentStep}
            completedSteps={formData.completedSteps}
            totalSteps={totalSteps}
            stepTitles={stepTitles}
          />

          {/* Current Step Content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <div>
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                >
                  ← Previous
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {hasErrors && (
                <div className="text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please fix errors above
                </div>
              )}
              
              <Button
                onClick={handleNext}
                disabled={hasErrors || isCalculating}
                loading={isCalculating}
              >
                {isLastStep ? (isCalculating ? 'Calculating...' : 'Calculate My Risk →') : 'Next →'}
              </Button>
            </div>
          </div>

          {/* Progress Save Notice - Simplified */}
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500 flex items-center justify-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Progress automatically saved • Private & secure • No registration required
            </p>
          </div>
        </div>
      </div>

      {/* Educational Footer - Simplified */}
      <StreamlinedFooter />
    </div>
  );
};

export default Calculator;