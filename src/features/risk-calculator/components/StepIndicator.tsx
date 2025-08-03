import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  stepTitles: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  totalSteps,
  stepTitles,
}) => {
  const getStepStatus = (step: number) => {
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (step: number) => {
    const status = getStepStatus(step);
    const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-primary-500 text-white`;
      case 'current':
        return `${baseClasses} bg-primary-100 text-primary-700 ring-2 ring-primary-500`;
      default:
        return `${baseClasses} bg-neutral-200 text-neutral-500`;
    }
  };

  const getConnectorClasses = (step: number) => {
    const isCompleted = completedSteps.includes(step) || completedSteps.includes(step + 1);
    return `flex-1 h-0.5 mx-4 ${isCompleted ? 'bg-primary-500' : 'bg-neutral-200'}`;
  };

  return (
    <div className="w-full py-6">
      {/* Progress bar */}
      <div className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div className={getStepClasses(stepNumber)}>
                  {completedSteps.includes(stepNumber) ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  getStepStatus(stepNumber) === 'current' 
                    ? 'text-primary-700' 
                    : getStepStatus(stepNumber) === 'completed'
                    ? 'text-primary-600'
                    : 'text-neutral-500'
                }`}>
                  {stepTitles[index]}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div className={getConnectorClasses(stepNumber)}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="text-center">
        <div className="text-sm text-neutral-600 mb-2">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 max-w-md mx-auto">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;