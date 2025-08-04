import React, { useState } from 'react';

const StreamlinedFooter: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white border-t border-neutral-200 mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Simplified Header */}
          <div className="text-center mb-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center text-lg font-semibold text-neutral-900 hover:text-prediction-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              About Bioprognostika Prediction Engine
              <svg 
                className={`w-4 h-4 ml-2 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <p className="text-sm text-neutral-600 mt-2">
              Clinical-grade algorithms for educational health prediction
            </p>
          </div>

          {/* Expandable Content */}
          {showDetails && (
            <div className="bg-gradient-to-r from-prediction-50 to-intelligence-50 rounded-lg border border-prediction-200 p-6">
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-prediction-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-prediction-800 mb-2">Clinical-Grade Algorithms</h4>
                  <p className="text-prediction-700 leading-relaxed">
                    Uses validated PCE (2013) and PREVENT (2024) equations with 25+ years of clinical research backing.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-intelligence-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-intelligence-800 mb-2">Evidence-Based Predictions</h4>
                  <p className="text-intelligence-700 leading-relaxed">
                    Algorithms trained on millions of patient outcomes to provide personalized cardiovascular risk assessment.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-healing-sage rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-healing-sage mb-2">Educational Focus</h4>
                  <p className="text-neutral-700 leading-relaxed">
                    Designed for health education and informed discussions with healthcare providers, not clinical diagnosis.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-prediction-200">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-prediction-700">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Privacy-first architecture
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 9a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
                    </svg>
                    Open source algorithms
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    Peer-reviewed evidence
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamlinedFooter;