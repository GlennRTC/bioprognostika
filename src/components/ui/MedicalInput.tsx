import React, { useState, useRef, useEffect } from 'react';
import { InputProps } from '@/types';
import MedicalTooltip, { MEDICAL_PARAMETERS } from './MedicalTooltip';

interface MedicalInputProps extends InputProps {
  medicalParameter?: keyof typeof MEDICAL_PARAMETERS;
  showMedicalTooltip?: boolean;
  clinicalContext?: string;
  normalRange?: string;
  warningThresholds?: {
    low?: number;
    high?: number;
    message?: string;
  };
  autoCalculate?: {
    depends: string[];
    formula: (values: Record<string, number>) => number;
  };
  dependentValues?: Record<string, number>;
  onWarning?: (warning: string | null) => void;
}

const MedicalInput: React.FC<MedicalInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  help,
  options,
  min,
  max,
  step,
  className = '',
  medicalParameter,
  showMedicalTooltip = true,
  clinicalContext,
  normalRange,
  warningThresholds,
  autoCalculate,
  dependentValues,
  onWarning
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-calculation effect
  useEffect(() => {
    if (autoCalculate && dependentValues) {
      const requiredValues = autoCalculate.depends.every(
        dep => dependentValues[dep] !== undefined && dependentValues[dep] !== null
      );
      
      if (requiredValues) {
        try {
          const calculated = autoCalculate.formula(dependentValues);
          setCalculatedValue(calculated);
          if (!value || value === 0) {
            onChange?.(calculated);
          }
        } catch (error) {
          console.warn('Auto-calculation failed:', error);
        }
      }
    }
  }, [autoCalculate, dependentValues, value, onChange]);

  // Warning threshold checking
  useEffect(() => {
    if (warningThresholds && typeof value === 'number' && value > 0) {
      let warning = null;
      
      if (warningThresholds.low && value < warningThresholds.low) {
        warning = warningThresholds.message || `Value below normal range (${warningThresholds.low})`;
      } else if (warningThresholds.high && value > warningThresholds.high) {
        warning = warningThresholds.message || `Value above normal range (${warningThresholds.high})`;
      }
      
      setWarningMessage(warning);
      onWarning?.(warning);
    } else {
      setWarningMessage(null);
      onWarning?.(null);
    }
  }, [value, warningThresholds, onWarning]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange?.(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Get status color based on value and thresholds
  const getStatusColor = () => {
    if (error) return 'border-red-300 bg-red-50 focus:ring-red-500';
    if (warningMessage) return 'border-amber-300 bg-amber-50 focus:ring-amber-500';
    if (normalRange && typeof value === 'number' && value > 0) {
      return 'border-green-300 bg-green-50 focus:ring-green-500';
    }
    return 'border-neutral-300 bg-white focus:ring-prediction-500';
  };

  const inputClasses = `
    w-full px-4 py-3 border rounded-xl transition-all duration-200 
    focus:ring-2 focus:border-transparent
    ${getStatusColor()}
    ${isFocused ? 'shadow-md' : ''}
    ${className}
  `;

  // Get medical parameter data
  const medicalData = medicalParameter ? MEDICAL_PARAMETERS[medicalParameter] : null;

  return (
    <div className="space-y-2">
      {/* Label with Medical Tooltip */}
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-medium text-neutral-700">
          <span className="flex items-center">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
            
            {/* Medical Tooltip */}
            {showMedicalTooltip && medicalData && (
              <MedicalTooltip
                parameter={medicalData}
                className="ml-2"
                triggerOnHover={true}
                triggerOnClick={false}
              >
                <span className="text-prediction-600 hover:text-prediction-800 cursor-help">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
              </MedicalTooltip>
            )}
          </span>
        </label>

        {/* Normal Range Indicator */}
        {normalRange && (
          <span className="text-xs text-neutral-500">
            Normal: {normalRange}
          </span>
        )}
      </div>

      {/* Input Field */}
      <div className="relative">
        {type === 'select' && options ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            required={required}
            className={inputClasses}
            ref={inputRef as any}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            step={step}
            className={inputClasses}
            ref={inputRef}
          />
        )}

        {/* Auto-calculated value indicator */}
        {calculatedValue !== null && (!value || value === 0) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-xs text-prediction-600 bg-prediction-100 px-2 py-1 rounded">
              Auto: {calculatedValue.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Help Text */}
      {help && !error && !warningMessage && (
        <p className="text-sm text-neutral-600 flex items-start">
          <svg className="w-4 h-4 mr-1 mt-0.5 text-neutral-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {help}
        </p>
      )}

      {/* Clinical Context */}
      {clinicalContext && !error && !warningMessage && (
        <div className="p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-800 flex items-start">
            <svg className="w-3 h-3 mr-1 mt-0.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <strong>Clinical Note:</strong> {clinicalContext}
          </p>
        </div>
      )}

      {/* Warning Message */}
      {warningMessage && !error && (
        <div className="p-2 bg-amber-50 rounded border border-amber-200">
          <p className="text-sm text-amber-800 flex items-start">
            <svg className="w-4 h-4 mr-1 mt-0.5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {warningMessage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 rounded border border-red-200">
          <p className="text-sm text-red-600 flex items-start">
            <svg className="w-4 h-4 mr-1 mt-0.5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Auto-calculation explanation */}
      {autoCalculate && calculatedValue !== null && (
        <div className="p-2 bg-prediction-50 rounded border border-prediction-200">
          <p className="text-xs text-prediction-800">
            <strong>Auto-calculated:</strong> This value is computed from {autoCalculate.depends.join(', ')}. 
            You can override by entering a value manually.
          </p>
        </div>
      )}

      {/* Value Status Indicator */}
      {typeof value === 'number' && value > 0 && normalRange && !warningMessage && !error && (
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1 text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Value within normal range</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalInput;