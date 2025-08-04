import React, { useState } from 'react';

interface AlgorithmInfoBannerProps {
  algorithm: 'PCE' | 'PREVENT';
  currentStep: number;
}

const AlgorithmInfoBanner: React.FC<AlgorithmInfoBannerProps> = ({ algorithm, currentStep }) => {
  const [showDetails, setShowDetails] = useState(false);

  const algorithmInfo = {
    PCE: {
      name: 'PCE 2013',
      shortDesc: '10-year cardiovascular risk (Ages 40-79)',
      fullDesc: 'Traditional Pooled Cohort Equations for 10-year cardiovascular risk assessment using established clinical parameters.',
      icon: '🩺',
      color: 'blue'
    },
    PREVENT: {
      name: 'PREVENT 2024',
      shortDesc: '10 & 30-year risk with kidney function (Ages 30-79)',
      fullDesc: 'Enhanced algorithm with kidney function assessment, providing both 10-year and 30-year cardiovascular risk estimates with improved accuracy.',
      icon: '🧬',
      color: 'purple'
    }
  };

  const info = algorithmInfo[algorithm];

  return (
    <div className={`bg-${info.color}-50 border border-${info.color}-200 rounded-lg overflow-hidden`}>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg mr-2">{info.icon}</span>
            <div>
              <span className={`font-semibold text-${info.color}-800`}>{info.name}:</span>
              <span className={`ml-2 text-sm text-${info.color}-700`}>{info.shortDesc}</span>
            </div>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-${info.color}-600 hover:text-${info.color}-800 transition-colors`}
            aria-label={showDetails ? 'Hide details' : 'Show details'}
          >
            <svg 
              className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {showDetails && (
        <div className={`border-t border-${info.color}-200 bg-${info.color}-25 p-3`}>
          <p className={`text-sm text-${info.color}-800 leading-relaxed`}>
            {info.fullDesc}
          </p>
          
          {/* Step-specific tips */}
          {currentStep === 1 && (
            <div className={`mt-3 p-2 bg-white rounded border border-${info.color}-200`}>
              <p className={`text-xs text-${info.color}-700`}>
                <strong>Step 1 Tip:</strong> Basic demographic information helps determine which algorithm coefficients to use for your risk calculation.
              </p>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className={`mt-3 p-2 bg-white rounded border border-${info.color}-200`}>
              <p className={`text-xs text-${info.color}-700`}>
                <strong>Step 2 Tip:</strong> Blood pressure and cholesterol are the strongest predictors of cardiovascular risk in both algorithms.
              </p>
            </div>
          )}
          
          {currentStep >= 3 && algorithm === 'PREVENT' && (
            <div className={`mt-3 p-2 bg-white rounded border border-${info.color}-200`}>
              <p className={`text-xs text-${info.color}-700`}>
                <strong>PREVENT Advantage:</strong> Kidney function (eGFR) significantly improves risk prediction accuracy, especially for long-term outcomes.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlgorithmInfoBanner;