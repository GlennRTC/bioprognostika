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

interface SubtleMedicalTooltipProps {
  parameter: MedicalParameter;
  children: React.ReactNode;
  mode?: 'subtle' | 'standard' | 'minimal';
  className?: string;
}

const SubtleMedicalTooltip: React.FC<SubtleMedicalTooltipProps> = ({
  parameter,
  children,
  mode = 'subtle',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Auto-position calculation
  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewport = { width: window.innerWidth, height: window.innerHeight };

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

      setPosition(bestPosition);
    }
  }, [isVisible]);

  const handleShow = () => setIsVisible(true);
  const handleHide = () => setIsVisible(false);

  const getPositionClasses = () => {
    const positions = {
      top: '-top-2 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2',
      bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2',
      right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2'
    };
    return positions[position];
  };

  const getArrowClasses = () => {
    const arrows = {
      top: 'top-full left-1/2 transform -translate-x-1/2 border-t-6 border-l-6 border-r-6 border-b-0 border-t-gray-800 border-l-transparent border-r-transparent',
      bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-6 border-l-6 border-r-6 border-t-0 border-b-gray-800 border-l-transparent border-r-transparent',
      left: 'left-full top-1/2 transform -translate-y-1/2 border-l-6 border-t-6 border-b-6 border-r-0 border-l-gray-800 border-t-transparent border-b-transparent',
      right: 'right-full top-1/2 transform -translate-y-1/2 border-r-6 border-t-6 border-b-6 border-l-0 border-r-gray-800 border-t-transparent border-b-transparent'
    };
    return arrows[position];
  };

  const getTriggerIcon = () => {
    if (mode === 'minimal') return null;
    
    const iconClass = mode === 'subtle' 
      ? 'w-3 h-3 text-neutral-400 hover:text-prediction-500 transition-colors opacity-60 hover:opacity-100'
      : 'w-4 h-4 text-prediction-500 hover:text-prediction-700 transition-colors';
    
    return (
      <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    );
  };

  const getTooltipContent = () => {
    if (mode === 'minimal') {
      return (
        <div className="p-3">
          <h4 className="font-medium text-white mb-1">{parameter.name}</h4>
          {parameter.normalRange && (
            <p className="text-xs text-gray-300">Normal: {parameter.normalRange}</p>
          )}
        </div>
      );
    }

    if (mode === 'subtle') {
      return (
        <div className="p-4 max-w-xs">
          <h4 className="font-medium text-white mb-2 text-sm">{parameter.name}</h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">{parameter.description}</p>
          {parameter.normalRange && (
            <div className="text-xs text-green-300">
              <span className="font-medium">Normal:</span> {parameter.normalRange}
            </div>
          )}
        </div>
      );
    }

    // Standard mode - full content
    return (
      <div className="p-4 max-w-sm">
        <h4 className="font-medium text-white mb-2">{parameter.name}</h4>
        <p className="text-sm text-gray-300 leading-relaxed mb-3">{parameter.description}</p>
        
        {parameter.normalRange && (
          <div className="mb-3 p-2 bg-gray-700 rounded text-xs">
            <span className="text-green-400 font-medium">Normal Range:</span>
            <span className="text-gray-300 ml-1">{parameter.normalRange}</span>
          </div>
        )}

        {parameter.warningThresholds && (
          <div className="mb-3 p-2 bg-yellow-900 bg-opacity-50 rounded text-xs">
            <span className="text-yellow-400 font-medium">Clinical Note:</span>
            <span className="text-gray-300 ml-1">{parameter.warningThresholds.message}</span>
          </div>
        )}

        <div className="text-xs text-gray-400 leading-relaxed">
          <span className="font-medium">Clinical Significance:</span> {parameter.clinicalSignificance}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative inline-block ${className}`} ref={triggerRef}>
      <div
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        className={`cursor-help inline-flex items-center ${mode === 'subtle' ? 'ml-1' : 'ml-2'}`}
        tabIndex={0}
        role="button"
        aria-expanded={isVisible}
        aria-describedby={isVisible ? 'medical-tooltip' : undefined}
      >
        {children}
        {getTriggerIcon()}
      </div>

      {isVisible && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
            onClick={handleHide}
            aria-hidden="true"
          />
          
          {/* Tooltip */}
          <div
            ref={tooltipRef}
            id="medical-tooltip"
            role="tooltip"
            className={`absolute z-50 bg-gray-800 text-white rounded-lg shadow-xl ${getPositionClasses()}`}
          >
            {/* Arrow */}
            <div className={`absolute w-0 h-0 ${getArrowClasses()}`} />
            
            {getTooltipContent()}
          </div>
        </>
      )}
    </div>
  );
};

// Pre-defined medical parameters for common use cases
export const SUBTLE_MEDICAL_PARAMETERS: Record<string, MedicalParameter> = {
  eGFR: {
    name: 'eGFR',
    description: 'Estimated kidney function based on creatinine levels. Lower values indicate reduced kidney function.',
    normalRange: '≥90 mL/min/1.73m²',
    unit: 'mL/min/1.73m²',
    clinicalSignificance: 'Key predictor in PREVENT algorithm. eGFR <60 significantly increases cardiovascular risk.',
    warningThresholds: {
      low: 60,
      message: 'Values <60 indicate chronic kidney disease'
    }
  },
  nonHdlCholesterol: {
    name: 'Non-HDL Cholesterol',
    description: 'Total cholesterol minus "good" HDL cholesterol. Captures all potentially harmful cholesterol.',
    normalRange: '<130 mg/dL',
    unit: 'mg/dL',
    clinicalSignificance: 'Better predictor than LDL alone. Used in both PCE and PREVENT algorithms.',
    warningThresholds: {
      high: 160,
      message: 'Elevated levels increase cardiovascular risk'
    }
  },
  hba1c: {
    name: 'HbA1c',
    description: 'Average blood sugar over 2-3 months. Key marker for diabetes control.',
    normalRange: '<5.7%',
    unit: '%',
    clinicalSignificance: 'Higher levels indicate increased cardiovascular risk in both algorithms.',
    warningThresholds: {
      high: 7,
      message: 'Values >7% indicate suboptimal diabetes control'
    }
  },
  socialDeprivationIndex: {
    name: 'Social Deprivation Index',
    description: 'Measure of neighborhood-level social disadvantage including income, education, and housing.',
    normalRange: '0-100 percentile',
    unit: 'Percentile',
    clinicalSignificance: 'Social determinants significantly impact cardiovascular outcomes. Used in PREVENT for enhanced accuracy.',
    warningThresholds: {
      high: 75,
      message: 'High deprivation may indicate need for additional support'
    }
  }
};

export default SubtleMedicalTooltip;