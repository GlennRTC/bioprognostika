import React, { useState, useRef, useEffect } from 'react';
import { ClinicalReference } from '@/types';

interface MedicalParameter {
  name: string;
  description: string;
  normalRange?: string;
  unit?: string;
  clinicalSignificance: string;
  references?: ClinicalReference[];
  warningThresholds?: {
    low?: number;
    high?: number;
    message: string;
  };
}

interface MedicalTooltipProps {
  parameter: MedicalParameter;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  className?: string;
  triggerOnHover?: boolean;
  triggerOnClick?: boolean;
}

const MedicalTooltip: React.FC<MedicalTooltipProps> = ({
  parameter,
  children,
  position = 'auto',
  className = '',
  triggerOnHover = true,
  triggerOnClick = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [computedPosition, setComputedPosition] = useState<'top' | 'bottom' | 'left' | 'right'>(position === 'auto' ? 'top' : position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Auto-position calculation for better UX
  useEffect(() => {
    if (isVisible && position === 'auto' && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Determine best position based on available space
      let bestPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
      
      if (triggerRect.top - tooltipRect.height < 20) {
        bestPosition = 'bottom';
      }
      if (triggerRect.left + tooltipRect.width > viewport.width - 20) {
        bestPosition = triggerRect.top > viewport.height / 2 ? 'top' : 'bottom';
      }
      if (triggerRect.left - tooltipRect.width < 20) {
        bestPosition = 'right';
      }

      setComputedPosition(bestPosition);
    }
  }, [isVisible, position]);

  const handleShow = () => setIsVisible(true);
  const handleHide = () => setIsVisible(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
    }
  };

  const getPositionClasses = () => {
    const positions = {
      top: '-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2'
    };
    return positions[computedPosition] || positions.top;
  };

  const getArrowClasses = () => {
    const arrows = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-t-8 border-l-8 border-r-8 border-b-0 border-t-white border-l-transparent border-r-transparent',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-8 border-l-8 border-r-8 border-t-0 border-b-white border-l-transparent border-r-transparent',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-l-8 border-t-8 border-b-8 border-r-0 border-l-white border-t-transparent border-b-transparent',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-r-8 border-t-8 border-b-8 border-l-0 border-r-white border-t-transparent border-b-transparent'
    };
    return arrows[computedPosition] || arrows.top;
  };

  return (
    <div className={`relative inline-block ${className}`} ref={triggerRef}>
      <div
        onMouseEnter={triggerOnHover ? handleShow : undefined}
        onMouseLeave={triggerOnHover ? handleHide : undefined}
        onClick={triggerOnClick ? () => setIsVisible(!isVisible) : undefined}
        onKeyDown={handleKeyDown}
        className="cursor-help inline-flex items-center"
        tabIndex={0}
        role="button"
        aria-expanded={isVisible}
        aria-describedby={isVisible ? 'medical-tooltip' : undefined}
      >
        {children}
        <svg 
          className="w-4 h-4 ml-1 text-prediction-500 hover:text-prediction-700 transition-colors" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      </div>

      {isVisible && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
            onClick={handleHide}
            aria-hidden="true"
          />
          
          {/* Tooltip Content */}
          <div
            ref={tooltipRef}
            id="medical-tooltip"
            role="tooltip"
            className={`absolute z-50 w-80 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg ${getPositionClasses()}`}
          >
            {/* Arrow */}
            <div className={`absolute w-0 h-0 ${getArrowClasses()}`} />
            
            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-neutral-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    {parameter.name}
                  </h4>
                  {parameter.unit && (
                    <span className="text-sm text-prediction-600 font-medium">({parameter.unit})</span>
                  )}
                </div>
                <button
                  onClick={handleHide}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close tooltip"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Description */}
              <div className="text-sm text-neutral-700 mb-3 leading-relaxed">
                {parameter.description}
              </div>

              {/* Normal Range */}
              {parameter.normalRange && (
                <div className="mb-3 p-2 bg-green-50 rounded border border-green-200">
                  <div className="text-sm">
                    <span className="font-medium text-green-800">Normal Range:</span>
                    <span className="ml-1 text-green-700">{parameter.normalRange}</span>
                  </div>
                </div>
              )}

              {/* Warning Thresholds */}
              {parameter.warningThresholds && (
                <div className="mb-3 p-2 bg-amber-50 rounded border border-amber-200">
                  <div className="text-sm">
                    <span className="font-medium text-amber-800">Clinical Note:</span>
                    <span className="ml-1 text-amber-700">{parameter.warningThresholds.message}</span>
                  </div>
                </div>
              )}

              {/* Clinical Significance */}
              <div className="mb-3">
                <h5 className="text-sm font-semibold text-neutral-900 mb-1">Clinical Significance</h5>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {parameter.clinicalSignificance}
                </p>
              </div>

              {/* References */}
              {parameter.references && parameter.references.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h5 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    Clinical Evidence
                  </h5>
                  <div className="space-y-2">
                    {parameter.references.map((ref, index) => (
                      <div key={ref.id} className="text-xs text-neutral-600">
                        <span className="font-medium">{index + 1}.</span> {ref.authors} ({ref.year}). {ref.journal}
                        {ref.pmid && (
                          <a
                            href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-prediction-600 hover:text-prediction-800 underline"
                          >
                            PubMed
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Pre-defined medical parameters for common use cases
export const MEDICAL_PARAMETERS: Record<string, MedicalParameter> = {
  eGFR: {
    name: 'Estimated Glomerular Filtration Rate',
    description: 'A measure of kidney function that estimates how well the kidneys filter waste from the blood. Lower values indicate reduced kidney function.',
    normalRange: '≥90 mL/min/1.73m²',
    unit: 'mL/min/1.73m²',
    clinicalSignificance: 'eGFR is crucial for cardiovascular risk assessment as kidney disease significantly increases the risk of heart disease and stroke. The PREVENT algorithm incorporates eGFR to provide more accurate risk prediction.',
    warningThresholds: {
      low: 60,
      message: 'eGFR <60 indicates chronic kidney disease and increased cardiovascular risk'
    }
  },
  nonHdlCholesterol: {
    name: 'Non-HDL Cholesterol',
    description: 'Total cholesterol minus HDL cholesterol. This measure captures all atherogenic (artery-clogging) lipoproteins in a single measurement.',
    normalRange: '<130 mg/dL (low risk), <160 mg/dL (moderate risk)',
    unit: 'mg/dL',
    clinicalSignificance: 'Non-HDL cholesterol is a better predictor of cardiovascular risk than LDL cholesterol alone because it includes all potentially harmful cholesterol particles.',
    warningThresholds: {
      high: 160,
      message: 'Elevated non-HDL cholesterol significantly increases cardiovascular risk'
    }
  },
  hba1c: {
    name: 'Hemoglobin A1c',
    description: 'A blood test that measures average blood sugar levels over the past 2-3 months. It reflects long-term glucose control in people with diabetes.',
    normalRange: '<5.7% (normal), 5.7-6.4% (prediabetes), ≥6.5% (diabetes)',
    unit: '%',
    clinicalSignificance: 'HbA1c is the gold standard for monitoring diabetes control. Higher levels indicate increased risk of cardiovascular complications and other diabetic complications.',
    warningThresholds: {
      high: 7,
      message: 'HbA1c >7% indicates suboptimal diabetes control and increased cardiovascular risk'
    }
  },
  socialDeprivationIndex: {
    name: 'Social Deprivation Index (SDI)',
    description: 'A comprehensive measure of neighborhood-level social disadvantage based on multiple socioeconomic factors including income, education, employment, housing quality, and household composition. The SDI helps identify areas where residents may face additional barriers to achieving optimal health.',
    normalRange: '0-100 percentile (0 = least deprived, 100 = most deprived)',
    unit: 'Percentile rank',
    clinicalSignificance: 'Social determinants of health are powerful predictors of cardiovascular outcomes. Higher SDI scores indicate greater social disadvantage, which is associated with increased rates of hypertension, diabetes, heart disease, stroke, and cardiovascular mortality. The PREVENT algorithm incorporates SDI to provide more personalized risk assessment that accounts for social and environmental factors beyond traditional clinical markers.',
    warningThresholds: {
      high: 75,
      message: 'High social deprivation (≥75th percentile) may indicate need for enhanced support services and community-based interventions'
    },
    references: [
      {
        id: 'social-determinants-health',
        authors: 'Havranek EP, Mujahid MS, Barr DA, et al.',
        title: 'Social Determinants of Risk and Outcomes for Cardiovascular Disease',
        journal: 'Circulation',
        year: 2015,
        pmid: '26199086',
        doi: '10.1161/CIR.0000000000000228'
      },
      {
        id: 'area-deprivation-index',
        authors: 'Kind AJH, Buckingham WR',
        title: 'Making Neighborhood-Disadvantage Metrics Accessible',
        journal: 'New England Journal of Medicine',
        year: 2018,
        pmid: '29562145',
        doi: '10.1056/NEJMp1802313'
      }
    ]
  },
  creatinine: {
    name: 'Serum Creatinine',
    description: 'A waste product produced by muscles and filtered by the kidneys. Higher levels may indicate reduced kidney function.',
    normalRange: '0.6-1.2 mg/dL (varies by gender and muscle mass)',
    unit: 'mg/dL',
    clinicalSignificance: 'Creatinine is used to calculate eGFR and assess kidney function. Even mild kidney dysfunction significantly increases cardiovascular risk.',
    warningThresholds: {
      high: 1.5,
      message: 'Elevated creatinine may indicate kidney dysfunction requiring clinical evaluation'
    }
  }
};

export default MedicalTooltip;