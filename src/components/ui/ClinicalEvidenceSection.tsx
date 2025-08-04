import React, { useState } from 'react';
import { ClinicalEvidencePanel } from '@/components/ui';

const ClinicalEvidenceSection: React.FC = () => {
  const [showFullEvidence, setShowFullEvidence] = useState(false);

  return (
    <div className="space-y-6">
      {/* Evidence Quality Overview */}
      <div className="bg-gradient-to-r from-healing-sage/10 to-primary-50/30 p-8 rounded-2xl border border-healing-sage/20">
        <div className="text-center mb-8">
          <h3 className="medical-heading-secondary text-neutral-900 mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 mr-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Clinical Evidence Foundation
          </h3>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Our cardiovascular risk prediction is built on decades of rigorous clinical research, validated across millions of participants worldwide.
          </p>
        </div>


        {/* Expand Clinical Evidence Button */}
        <div className="text-center">
          <button
            onClick={() => setShowFullEvidence(!showFullEvidence)}
            className="inline-flex items-center px-6 py-3 bg-white border border-primary-300 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            {showFullEvidence ? 'Hide' : 'View'} Detailed Clinical Evidence & References
            <svg 
              className={`w-4 h-4 ml-2 transition-transform ${showFullEvidence ? 'rotate-180' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Full Clinical Evidence Panel */}
      {showFullEvidence && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h4 className="text-lg font-semibold text-neutral-900">Complete Clinical Evidence Database</h4>
            <p className="text-sm text-neutral-600 mt-1">
              Comprehensive research foundation underlying our cardiovascular risk algorithms
            </p>
          </div>
          <div className="p-6">
            <ClinicalEvidencePanel showFullReferences={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalEvidenceSection;