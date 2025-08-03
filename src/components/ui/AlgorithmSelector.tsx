import React, { useState } from 'react';
import { ClinicalReference } from '@/types';
import ReferenceBadge from './ReferenceBadge';
import MedicalTooltip, { MEDICAL_PARAMETERS } from './MedicalTooltip';

interface AlgorithmOption {
  id: 'PCE' | 'PREVENT';
  name: string;
  fullName: string;
  year: number;
  ageRange: string;
  timeline: string;
  keyFeatures: string[];
  advantages: string[];
  limitations: string[];
  recommendedFor: string[];
  stepCount: number;
  requiredParameters: string[];
  clinicalReferences: ClinicalReference[];
}

interface AlgorithmSelectorProps {
  selectedAlgorithm: 'PCE' | 'PREVENT';
  onAlgorithmChange: (algorithm: 'PCE' | 'PREVENT') => void;
  currentStep?: number;
  className?: string;
  showComparison?: boolean;
  disabled?: boolean;
}

const ALGORITHM_OPTIONS: AlgorithmOption[] = [
  {
    id: 'PCE',
    name: 'PCE',
    fullName: 'Pooled Cohort Equations',
    year: 2013,
    ageRange: '40-79 years',
    timeline: '10-year risk',
    stepCount: 3,
    keyFeatures: [
      'Validated across diverse populations',
      'Widely adopted clinical standard',
      'Simpler parameter requirements',
      'Extensive real-world validation'
    ],
    advantages: [
      'Gold standard for 10-year CV risk',
      'Integrated into clinical guidelines',
      'Proven clinical decision support',
      'Broad demographic validation'
    ],
    limitations: [
      'Limited to 10-year timeframe',
      'Does not include kidney function',
      'Age restrictions (40-79 years)',
      'May underestimate risk in some populations'
    ],
    recommendedFor: [
      'Standard clinical risk assessment',
      'Patients aged 40-79',
      'Initial cardiovascular screening',
      'Compliance with clinical guidelines'
    ],
    requiredParameters: [
      'Age, gender, race',
      'Blood pressure',
      'Total & HDL cholesterol',
      'Diabetes status',
      'Smoking status'
    ],
    clinicalReferences: [
      {
        id: 'pce-2013',
        authors: 'Goff DC Jr, Lloyd-Jones DM, Bennett G, et al.',
        title: '2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk',
        journal: 'Circulation',
        year: 2014,
        pmid: '24222018',
        doi: '10.1161/01.cir.0000437741.48606.98',
        summary: 'Landmark guideline establishing PCE as the standard for cardiovascular risk assessment'
      }
    ]
  },
  {
    id: 'PREVENT',
    name: 'PREVENT',
    fullName: 'Predicting Risk of CVD EVENTs',
    year: 2024,
    ageRange: '30-79 years',
    timeline: '10-year & 30-year risk',
    stepCount: 4,
    keyFeatures: [
      'Dual timeline prediction (10 & 30-year)',
      'Includes kidney function (eGFR)',
      'Enhanced cholesterol assessment',
      'Social determinants integration',
      'Broader age range (30-79 years)'
    ],
    advantages: [
      'More comprehensive risk factors',
      'Longer-term risk prediction',
      'Better discrimination in younger adults',
      'Includes kidney disease impact',
      'Social determinants consideration'
    ],
    limitations: [
      'Newer algorithm (less validation)',
      'More complex parameter requirements',
      'May not be in all guidelines yet',
      'Requires additional lab values'
    ],
    recommendedFor: [
      'Comprehensive risk assessment',
      'Younger adults (30-40 years)',
      'Patients with kidney disease',
      'Long-term risk planning',
      'Research and advanced clinical practice'
    ],
    requiredParameters: [
      'All PCE parameters',
      'Non-HDL cholesterol',
      'Kidney function (eGFR)',
      'Optional: HbA1c, social factors'
    ],
    clinicalReferences: [
      {
        id: 'prevent-2024',
        authors: 'Khan SS, Matsushita K, Sang Y, et al.',
        title: 'Development and Validation of the American Heart Association\'s PREVENT Equations',
        journal: 'Circulation',
        year: 2024,
        pmid: '38440987',
        doi: '10.1161/CIRCULATIONAHA.123.067626',
        summary: 'Contemporary equations for cardiovascular risk prediction with enhanced discrimination'
      }
    ]
  }
];

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  currentStep = 1,
  className = '',
  showComparison = true,
  disabled = false
}) => {
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);
  const selectedOption = ALGORITHM_OPTIONS.find(opt => opt.id === selectedAlgorithm)!;
  const alternativeOption = ALGORITHM_OPTIONS.find(opt => opt.id !== selectedAlgorithm)!;

  const handleAlgorithmSwitch = (newAlgorithm: 'PCE' | 'PREVENT') => {
    if (disabled) return;
    
    // Warn user if they're switching mid-flow
    if (currentStep > 1) {
      const shouldSwitch = window.confirm(
        `Switching algorithms will reset your progress to Step 1. This is because ${newAlgorithm} requires different parameters. Continue?`
      );
      if (!shouldSwitch) return;
    }
    
    onAlgorithmChange(newAlgorithm);
  };

  return (
    <div className={`${className}`}>
      {/* Main Algorithm Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {ALGORITHM_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedAlgorithm === option.id
                ? 'ring-2 ring-prediction-500 bg-prediction-50'
                : 'hover:bg-gray-50 hover:shadow-md'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => handleAlgorithmSwitch(option.id)}
          >
            <div className="p-4 border rounded-lg">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="text-lg font-bold text-neutral-900">
                      {option.name} ({option.year})
                    </h3>
                    {selectedAlgorithm === option.id && (
                      <svg className="w-5 h-5 ml-2 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 font-medium">{option.fullName}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {option.clinicalReferences.map((ref) => (
                    <ReferenceBadge key={ref.id} referenceId={ref.id} variant="small" />
                  ))}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-neutral-500">Age Range:</span>
                  <span className="ml-1 font-medium text-neutral-700">{option.ageRange}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Timeline:</span>
                  <span className="ml-1 font-medium text-neutral-700">{option.timeline}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Steps:</span>
                  <span className="ml-1 font-medium text-neutral-700">{option.stepCount} steps</span>
                </div>
                <div>
                  <span className="text-neutral-500">Parameters:</span>
                  <span className="ml-1 font-medium text-neutral-700">{option.requiredParameters.length} sets</span>
                </div>
              </div>

              {/* Key Features Preview */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Key Features</p>
                <ul className="text-sm text-neutral-700 space-y-1">
                  {option.keyFeatures.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-3 h-3 mt-1 mr-1 text-prediction-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection Indicator */}
              {selectedAlgorithm === option.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-prediction-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Comparison Toggle */}
      {showComparison && (
        <div className="mb-4">
          <button
            onClick={() => setShowDetailedComparison(!showDetailedComparison)}
            className="text-sm text-prediction-600 hover:text-prediction-800 font-medium flex items-center transition-colors"
          >
            <svg 
              className={`w-4 h-4 mr-1 transition-transform ${showDetailedComparison ? 'rotate-180' : ''}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {showDetailedComparison ? 'Hide' : 'Show'} Detailed Comparison
          </button>
        </div>
      )}

      {/* Detailed Algorithm Comparison */}
      {showDetailedComparison && (
        <div className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden">
          <div className="bg-neutral-100 px-4 py-3 border-b border-neutral-200">
            <h4 className="text-lg font-semibold text-neutral-900 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Algorithm Comparison
            </h4>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ALGORITHM_OPTIONS.map((option) => (
                <div key={option.id} className="space-y-4">
                  <h5 className="text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-2">
                    {option.name} ({option.year})
                  </h5>
                  
                  {/* Advantages */}
                  <div>
                    <h6 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Advantages
                    </h6>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      {option.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0" />
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best For */}
                  <div>
                    <h6 className="text-sm font-semibold text-prediction-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                      </svg>
                      Best For
                    </h6>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      {option.recommendedFor.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 rounded-full bg-prediction-500 mt-2 mr-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Parameters */}
                  <div>
                    <h6 className="text-sm font-semibold text-neutral-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Required Data
                    </h6>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      {option.requiredParameters.map((param, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 rounded-full bg-neutral-400 mt-2 mr-2 flex-shrink-0" />
                          {param}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  <div>
                    <h6 className="text-sm font-semibold text-amber-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Limitations
                    </h6>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      {option.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 mr-2 flex-shrink-0" />
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Clinical Decision Guide */}
            <div className="mt-6 p-4 bg-gradient-to-r from-prediction-50 to-intelligence-50 rounded-lg border border-prediction-200">
              <h6 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Selection Guide
              </h6>
              <div className="text-sm text-neutral-700 space-y-2">
                <p><strong>Choose PCE if:</strong> You need standard clinical risk assessment, are following established guidelines, or have age 40-79 with basic lab values available.</p>
                <p><strong>Choose PREVENT if:</strong> You want comprehensive risk assessment, have kidney function data available, need long-term risk prediction, or are aged 30-40.</p>
                <p className="mt-3 text-xs text-prediction-700 bg-prediction-100 p-2 rounded"><strong>Note:</strong> Both algorithms are clinically validated. Your choice depends on available data and clinical context.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Selection Summary */}
      <div className="mt-4 p-3 bg-white border border-prediction-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-neutral-600">Current Selection:</span>
            <span className="ml-2 font-semibold text-prediction-700">
              {selectedOption.name} ({selectedOption.year}) - {selectedOption.stepCount} steps
            </span>
          </div>
          {currentStep > 1 && (
            <span className="text-xs text-amber-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Switching will reset progress
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmSelector;