import React from 'react';
import { ClinicalReference } from '@/types';
import { formatCitation, getPubMedUrl, getDoiUrl } from '@/features/risk-calculator/services/clinicalUtils';

interface ReferenceListProps {
  references: ClinicalReference[];
  title?: string;
  className?: string;
  showLinks?: boolean;
}

const ReferenceList: React.FC<ReferenceListProps> = ({
  references,
  title = 'Clinical References',
  className = '',
  showLinks = true
}) => {
  if (references.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200 ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
        {title}
      </h4>
      
      <div className="space-y-3">
        {references.map((reference, index) => (
          <div key={reference.id} className="text-sm">
            <div className="text-gray-700">
              <span className="font-medium text-gray-500">{index + 1}.</span>
              {' '}
              {formatCitation(reference)}
            </div>
            
            {reference.summary && (
              <div className="text-gray-600 text-xs mt-1 ml-4 italic">
                {reference.summary}
              </div>
            )}
            
            {showLinks && (
              <div className="flex space-x-3 text-xs mt-1 ml-4">
                {reference.pmid && (
                  <a
                    href={getPubMedUrl(reference.pmid)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    PubMed
                  </a>
                )}
                
                {reference.doi && (
                  <a
                    href={getDoiUrl(reference.doi)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
                    </svg>
                    DOI
                  </a>
                )}
                
                {reference.url && (
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                    Full Text
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
        <strong>Note:</strong> These references support the clinical evidence and algorithms used in this educational tool. 
        Always consult current medical literature and guidelines for clinical decision-making.
      </div>
    </div>
  );
};

export default ReferenceList;