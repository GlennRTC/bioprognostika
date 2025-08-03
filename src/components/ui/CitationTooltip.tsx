import React, { useState } from 'react';
import { ClinicalReference } from '@/types';
import { getPubMedUrl, getDoiUrl, formatCitation, CLINICAL_REFERENCES } from '@/features/risk-calculator/services/clinicalUtils';

interface CitationTooltipProps {
  referenceId: string;
  children: React.ReactNode;
  className?: string;
}

const CitationTooltip: React.FC<CitationTooltipProps> = ({
  referenceId,
  children,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const reference = CLINICAL_REFERENCES[referenceId];
  
  if (!reference) {
    return <>{children}</>;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg -top-2 left-full ml-2">
          <div className="text-sm">
            <div className="font-semibold text-gray-900 mb-2">
              {reference.title}
            </div>
            
            <div className="text-gray-700 mb-2">
              {reference.authors}
            </div>
            
            <div className="text-gray-600 mb-2">
              <em>{reference.journal}</em> ({reference.year})
            </div>
            
            {reference.summary && (
              <div className="text-gray-700 mb-3 text-xs leading-relaxed">
                {reference.summary}
              </div>
            )}
            
            <div className="flex space-x-3 text-xs">
              {reference.pmid && (
                <a
                  href={getPubMedUrl(reference.pmid)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  PubMed
                </a>
              )}
              
              {reference.doi && (
                <a
                  href={getDoiUrl(reference.doi)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  DOI
                </a>
              )}
              
              {reference.url && (
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Full Text
                </a>
              )}
            </div>
          </div>
          
          {/* Arrow pointer */}
          <div className="absolute top-4 -left-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white"></div>
          <div className="absolute top-4 -left-3 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-200"></div>
        </div>
      )}
    </div>
  );
};

export default CitationTooltip;