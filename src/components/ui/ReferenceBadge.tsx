import React from 'react';
import { ClinicalReference } from '@/types';
import { CLINICAL_REFERENCES } from '@/features/risk-calculator/services/clinicalUtils';
import CitationTooltip from './CitationTooltip';

interface ReferenceBadgeProps {
  referenceId: string;
  variant?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ReferenceBadge: React.FC<ReferenceBadgeProps> = ({
  referenceId,
  variant = 'small',
  showTooltip = true,
  size = 'md',
  className = ''
}) => {
  const reference = CLINICAL_REFERENCES[referenceId];
  
  if (!reference) {
    return null;
  }
  
  // Generate short reference text
  const shortRef = `${reference.authors.split(',')[0]} et al. ${reference.year}`;
  
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    medium: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2'
  };

  const badge = (
    <span className={`
      inline-flex items-center bg-blue-100 text-blue-800 rounded-full font-medium
      hover:bg-blue-200 transition-colors cursor-help
      ${sizeClasses[variant]}
    `}>
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
      {shortRef}
    </span>
  );

  if (showTooltip) {
    return (
      <CitationTooltip referenceId={referenceId}>
        {badge}
      </CitationTooltip>
    );
  }

  return badge;
};

export default ReferenceBadge;