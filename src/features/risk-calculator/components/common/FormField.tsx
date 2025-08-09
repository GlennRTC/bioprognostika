/**
 * Reusable FormField Component
 * Standardized form field with validation, help text, and consistent styling
 */

import React, { memo } from 'react';
import { Input } from '@/components/ui';
import { StepFieldConfig } from '../../config/stepConfig';
import { PatientParams } from '@/types';

interface FormFieldProps {
  config: StepFieldConfig;
  value: any;
  error?: string;
  onChange: (field: keyof PatientParams, value: any) => void;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = memo(({
  config,
  value,
  error,
  onChange,
  className
}) => {
  const handleChange = (newValue: any) => {
    // Handle different field types
    let processedValue = newValue;
    
    if (config.type === 'number') {
      processedValue = newValue === '' ? undefined : Number(newValue);
    } else if (config.type === 'checkbox') {
      processedValue = Boolean(newValue);
    }
    
    onChange(config.key, processedValue);
  };

  // Render different input types
  if (config.type === 'checkbox') {
    return (
      <div className={`${className || ''}`}>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => handleChange(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-neutral-700">{config.label}</span>
        </label>
        {config.help && (
          <p className="mt-1 text-xs text-neutral-500">{config.help}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Regular input fields
  return (
    <div className={className || ''}>
      <Input
        label={config.label}
        name={config.key}
        type={config.type}
        value={value || ''}
        onChange={handleChange}
        placeholder={config.placeholder}
        min={config.min}
        max={config.max}
        step={config.step}
        required={config.required}
        error={error}
        help={config.help}
        options={config.options ? [...config.options] : undefined}
      />
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;