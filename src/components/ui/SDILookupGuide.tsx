import React, { useState } from 'react';
import { Disclaimer } from '@/components/ui';
import CitationTooltip from './CitationTooltip';

interface SDILookupGuideProps {
  onScoreEntered?: (score: number) => void;
  currentScore?: number;
  className?: string;
}

const SDILookupGuide: React.FC<SDILookupGuideProps> = ({
  onScoreEntered,
  currentScore,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [zipCode, setZipCode] = useState('');
  const [manualScore, setManualScore] = useState('');

  const lookupMethods = [
    {
      id: 'adi-mapper',
      name: 'University of Wisconsin ADI Mapper',
      description: 'Official Area Deprivation Index tool',
      url: 'https://www.neighborhoodatlas.medicine.wisc.edu/',
      steps: [
        'Visit the University of Wisconsin ADI Neighborhood Atlas',
        'Enter your ZIP code or address in the search box',
        'Click on your specific area on the map',
        'Note the ADI National Percentile (0-100)',
        'Enter this percentile as your SDI score'
      ],
      reliability: 'High - Official academic source'
    },
    {
      id: 'census-data',
      name: 'US Census Bureau',
      description: 'Government census and community survey data',
      url: 'https://data.census.gov/',
      steps: [
        'Visit the US Census Bureau Data Portal',
        'Search for "American Community Survey" data',
        'Enter your ZIP code or county',
        'Look for poverty rates, education levels, and employment data',
        'Compare to national averages to estimate percentile'
      ],
      reliability: 'High - Official government source'
    },
    {
      id: 'healthcare-provider',
      name: 'Healthcare Provider',
      description: 'Ask your doctor or healthcare team',
      steps: [
        'Contact your healthcare provider\'s office',
        'Ask if they have access to social determinants screening tools',
        'Request your neighborhood\'s social deprivation percentile',
        'Some electronic health records include this data automatically'
      ],
      reliability: 'High - Clinical context available'
    },
    {
      id: 'estimate',
      name: 'General Estimation',
      description: 'Rough estimate based on area characteristics',
      steps: [
        'Consider your neighborhood\'s general characteristics',
        'Urban areas: typically 20-60th percentile',
        'Suburban areas: typically 10-40th percentile',  
        'Rural areas: varies widely (10-80th percentile)',
        'High-income areas: typically <25th percentile',
        'Low-income areas: typically >75th percentile'
      ],
      reliability: 'Lower - General approximation only'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleManualScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualScore(value);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      onScoreEntered?.(numValue);
    }
  };

  const getScoreInterpretation = (score: number) => {
    if (score < 25) return { level: 'Low', color: 'text-green-700 bg-green-50', description: 'Lower social disadvantage' };
    if (score < 50) return { level: 'Low-Moderate', color: 'text-blue-700 bg-blue-50', description: 'Below average social disadvantage' };
    if (score < 75) return { level: 'Moderate-High', color: 'text-amber-700 bg-amber-50', description: 'Above average social disadvantage' };
    return { level: 'High', color: 'text-red-700 bg-red-50', description: 'Higher social disadvantage' };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>How to find my Social Deprivation Index</span>
        </button>

        {currentScore !== undefined && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-neutral-600">Current:</span>
            <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreInterpretation(currentScore).color}`}>
              {currentScore}th percentile
            </span>
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
          {/* Introduction */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-indigo-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Finding Your Social Deprivation Index
            </h4>
            <p className="text-sm text-indigo-800 mb-4">
              The Social Deprivation Index (SDI) helps assess how social and economic factors in your neighborhood 
              might affect your cardiovascular health. Choose one of the methods below to find your score:
            </p>
          </div>

          {/* Method Selection */}
          <div className="space-y-4 mb-6">
            <h5 className="font-medium text-indigo-900">Select a lookup method:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lookupMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedMethod === method.id
                      ? 'border-indigo-500 bg-indigo-100 shadow-md'
                      : 'border-indigo-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className="font-medium text-indigo-900 mb-1">{method.name}</div>
                  <div className="text-sm text-indigo-700 mb-2">{method.description}</div>
                  <div className="text-xs text-indigo-600">
                    <span className="font-medium">Reliability:</span> {method.reliability}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Method Details */}
          {selectedMethod && (
            <div className="mb-6 p-4 bg-white rounded-lg border border-indigo-200">
              {(() => {
                const method = lookupMethods.find(m => m.id === selectedMethod);
                return method ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-semibold text-indigo-900">{method.name}</h6>
                      {method.url && (
                        <a
                          href={method.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800 underline flex items-center"
                        >
                          Visit Site
                          <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-indigo-800">Step-by-step instructions:</p>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-indigo-700">
                        {method.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Manual Score Entry */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-indigo-900 mb-2">
              Enter your SDI score (0-100 percentile):
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="0"
                max="100"
                value={manualScore}
                onChange={handleManualScoreChange}
                placeholder="e.g., 45"
                className="w-24 px-3 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="text-sm text-indigo-700">percentile</span>
              {manualScore && !isNaN(parseFloat(manualScore)) && (
                <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreInterpretation(parseFloat(manualScore)).color}`}>
                  {getScoreInterpretation(parseFloat(manualScore)).level} - {getScoreInterpretation(parseFloat(manualScore)).description}
                </div>
              )}
            </div>
          </div>

          {/* Score Interpretation Guide */}
          <div className="mb-4 p-3 bg-white rounded-lg border border-indigo-200">
            <h6 className="font-medium text-indigo-900 mb-2">Understanding SDI Scores:</h6>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-200 rounded"></div>
                <span>0-24: Low disadvantage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-200 rounded"></div>
                <span>25-49: Low-moderate disadvantage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-200 rounded"></div>
                <span>50-74: Moderate-high disadvantage</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-200 rounded"></div>
                <span>75-100: High disadvantage</span>
              </div>
            </div>
          </div>

          {/* Clinical Context */}
          <Disclaimer type="info" className="mb-4">
            <div className="text-sm space-y-2">
              <p>
                <strong>Clinical Note:</strong> The SDI is optional but helps provide more personalized risk assessment. 
                If you cannot find your exact score, you can:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Leave this field blank (the calculator will work without it)</li>
                <li>Use a general estimate based on your area's characteristics</li>
                <li>Ask your healthcare provider if they have this information</li>
              </ul>
            </div>
          </Disclaimer>

          {/* Evidence References */}
          <div className="text-xs text-indigo-600">
            <p className="mb-1">
              <strong>Evidence Base:</strong> Social determinants significantly impact cardiovascular outcomes.
            </p>
            <div className="flex space-x-4">
              <CitationTooltip referenceId="social-determinants-health">
                <span className="underline cursor-help">AHA Scientific Statement (2015)</span>
              </CitationTooltip>
              <CitationTooltip referenceId="area-deprivation-index">
                <span className="underline cursor-help">NEJM Perspective (2018)</span>
              </CitationTooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SDILookupGuide;