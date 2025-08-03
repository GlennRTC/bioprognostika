import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui';
import AlgorithmSelector from './AlgorithmSelector';
import ReferenceBadge from './ReferenceBadge';
import { ClinicalReference } from '@/types';

interface HeaderProps {
  selectedAlgorithm?: 'PCE' | 'PREVENT';
  onAlgorithmChange?: (algorithm: 'PCE' | 'PREVENT') => void;
  currentStep?: number;
  totalSteps?: number;
  showAlgorithmSelector?: boolean;
  className?: string;
}

// Key clinical references for header display
const HEADER_REFERENCES: ClinicalReference[] = [
  {
    id: 'pce-primary',
    authors: 'Goff DC Jr, Lloyd-Jones DM, Bennett G, et al.',
    title: '2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk',
    journal: 'Circulation',
    year: 2014,
    pmid: '24222018',
    doi: '10.1161/01.cir.0000437741.48606.98',
    summary: 'Established PCE as the clinical standard for cardiovascular risk assessment'
  },
  {
    id: 'prevent-primary',
    authors: 'Khan SS, Matsushita K, Sang Y, et al.',
    title: 'Development and Validation of the American Heart Association\'s PREVENT Equations',
    journal: 'Circulation',
    year: 2024,
    pmid: '38440987',
    doi: '10.1161/CIRCULATIONAHA.123.067626',
    summary: 'Next-generation cardiovascular risk prediction with enhanced accuracy'
  }
];

const Header: React.FC<HeaderProps> = ({
  selectedAlgorithm = 'PREVENT',
  onAlgorithmChange,
  currentStep,
  totalSteps,
  showAlgorithmSelector = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAlgorithmPanel, setShowAlgorithmPanel] = useState(false);
  
  const isCalculatorPage = location.pathname === '/calculator';
  const isResultsPage = location.pathname === '/results';
  
  const getProgressInfo = () => {
    if (!currentStep || !totalSteps) return null;
    const percentage = (currentStep / totalSteps) * 100;
    return { currentStep, totalSteps, percentage };
  };

  const getAlgorithmInfo = () => {
    const algorithmData = {
      PCE: {
        name: 'PCE 2013',
        description: 'Pooled Cohort Equations for 10-year cardiovascular risk (Ages 40-79)',
        reference: HEADER_REFERENCES.find(ref => ref.id === 'pce-primary')!
      },
      PREVENT: {
        name: 'PREVENT 2024',
        description: 'Enhanced algorithm with kidney function, 10 & 30-year risk (Ages 30-79)',
        reference: HEADER_REFERENCES.find(ref => ref.id === 'prevent-primary')!
      }
    };
    return algorithmData[selectedAlgorithm];
  };

  const progressInfo = getProgressInfo();
  const algorithmInfo = getAlgorithmInfo();

  return (
    <header className={`bg-white shadow-sm border-b border-neutral-200 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
            >
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-prediction-500 to-intelligence-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Title */}
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-neutral-900 leading-tight">
                  Bioprognostika
                </h1>
                <p className="text-sm text-prediction-600 font-medium">
                  Health Prediction Platform
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Clinical Evidence Badge */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-neutral-600">Evidence-Based:</span>
              <div className="flex items-center space-x-1">
                {HEADER_REFERENCES.map((ref) => (
                  <ReferenceBadge key={ref.id} referenceId={ref.id} variant="small" />
                ))}
              </div>
            </div>

            {/* Algorithm Selection (if enabled) */}
            {showAlgorithmSelector && onAlgorithmChange && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-neutral-600">Algorithm:</span>
                <button
                  onClick={() => setShowAlgorithmPanel(!showAlgorithmPanel)}
                  className="flex items-center space-x-1 px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
                >
                  <span className="font-medium text-prediction-700">{algorithmInfo.name}</span>
                  <svg 
                    className={`w-4 h-4 text-neutral-500 transition-transform ${showAlgorithmPanel ? 'rotate-180' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex items-center space-x-3">
              {!isCalculatorPage && !isResultsPage && (
                <Button
                  onClick={() => navigate('/calculator')}
                  className="bg-gradient-to-r from-prediction-600 to-primary-600 hover:from-prediction-700 hover:to-primary-700"
                >
                  Start Assessment
                </Button>
              )}
              
              {(isCalculatorPage || isResultsPage) && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="border-prediction-300 text-prediction-700 hover:bg-prediction-50"
                >
                  ← Back to Home
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              {showMobileMenu ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>

        {/* Progress Bar (Calculator Page) */}
        {progressInfo && isCalculatorPage && (
          <div className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-700">
                Step {progressInfo.currentStep} of {progressInfo.totalSteps}
              </span>
              <span className="text-sm text-neutral-500">
                {Math.round(progressInfo.percentage)}% Complete
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-prediction-500 to-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressInfo.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Algorithm Info Panel (Calculator Page) */}
        {isCalculatorPage && (
          <div className="pb-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-prediction-50 to-intelligence-50 rounded-lg border border-prediction-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-semibold text-prediction-800">
                    {algorithmInfo.name}
                  </h3>
                  <ReferenceBadge referenceId={algorithmInfo.reference.id} variant="small" />
                </div>
                <p className="text-sm text-prediction-700">
                  {algorithmInfo.description}
                </p>
              </div>
              
              {showAlgorithmSelector && onAlgorithmChange && (
                <button
                  onClick={() => setShowAlgorithmPanel(!showAlgorithmPanel)}
                  className="ml-4 px-3 py-1 text-xs bg-white border border-prediction-300 rounded text-prediction-700 hover:bg-prediction-50 transition-colors"
                >
                  Switch Algorithm
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Algorithm Selection */}
            {showAlgorithmSelector && onAlgorithmChange && (
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">Algorithm Selection</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAlgorithmPanel(!showAlgorithmPanel);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="text-left">
                      <p className="font-medium text-neutral-900">{algorithmInfo.name}</p>
                      <p className="text-sm text-neutral-600">{algorithmInfo.description}</p>
                    </div>
                    <svg className="w-5 h-5 text-neutral-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Clinical Evidence */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 mb-2">Clinical Evidence</h4>
              <div className="flex flex-wrap gap-2">
                {HEADER_REFERENCES.map((ref) => (
                  <ReferenceBadge key={ref.id} referenceId={ref.id} variant="medium" />
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-2 pt-4 border-t border-neutral-200">
              {!isCalculatorPage && !isResultsPage && (
                <Button
                  onClick={() => {
                    navigate('/calculator');
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-gradient-to-r from-prediction-600 to-primary-600"
                >
                  Start Assessment
                </Button>
              )}
              
              {(isCalculatorPage || isResultsPage) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    navigate('/');
                    setShowMobileMenu(false);
                  }}
                  className="w-full border-prediction-300 text-prediction-700"
                >
                  ← Back to Home
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Algorithm Selection Panel */}
      {showAlgorithmPanel && showAlgorithmSelector && onAlgorithmChange && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border-b border-neutral-200 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <AlgorithmSelector
                selectedAlgorithm={selectedAlgorithm}
                onAlgorithmChange={(algorithm) => {
                  onAlgorithmChange(algorithm);
                  setShowAlgorithmPanel(false);
                }}
                currentStep={currentStep}
                showComparison={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {(showMobileMenu || showAlgorithmPanel) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => {
            setShowMobileMenu(false);
            setShowAlgorithmPanel(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;