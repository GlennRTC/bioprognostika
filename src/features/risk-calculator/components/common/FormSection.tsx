/**
 * FormSection Component
 * Groups related form fields with consistent styling and icons
 */

import React, { memo } from 'react';
import FormField from './FormField';
import { StepFieldConfig } from '../../config/stepConfig';
import { PatientParams } from '@/types';

interface FormSectionProps {
  title: string;
  description?: string;
  fields: StepFieldConfig[];
  formData: Partial<PatientParams>;
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
  className?: string;
  icon?: string;
}

const FormSection: React.FC<FormSectionProps> = memo(({
  title,
  description,
  fields,
  formData,
  errors,
  updateField,
  className,
  icon
}) => {
  const getIconSvg = (iconType?: string) => {
    switch (iconType) {
      case 'blood-pressure':
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'lab-results':
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
          </svg>
        );
      case 'medical-history':
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={className || 'bg-white p-4 rounded-xl border border-neutral-200'}>
      <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
        {icon && getIconSvg(icon)}
        {title}
      </h4>
      
      {description && (
        <p className="text-sm text-neutral-600 mb-4">{description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <FormField
            key={field.key}
            config={field}
            value={formData[field.key]}
            error={errors[field.key]}
            onChange={updateField}
            className={field.type === 'checkbox' ? 'md:col-span-2' : ''}
          />
        ))}
      </div>
    </div>
  );
});

FormSection.displayName = 'FormSection';

export default FormSection;