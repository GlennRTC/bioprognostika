import React, { useState } from 'react';
import { CitationTooltip, ReferenceBadge } from '@/components/ui';

interface AlgorithmInfo {
  id: 'PCE' | 'PREVENT';
  name: string;
  fullName: string;
  year: number;
  ageRange: string;
  timeline: string;
  description: string;
  keyFeatures: string[];
  technicalDetails: {
    methodology: string;
    sampleSize: string;
    validation: string;
    accuracy: string;
  };
  advantages: string[];
  limitations: string[];
  clinicalUse: string;
}

const ALGORITHM_DATA: AlgorithmInfo[] = [
  {
    id: 'PCE',
    name: 'PCE',
    fullName: 'Pooled Cohort Equations',
    year: 2013,
    ageRange: '40-79 years',
    timeline: '10-year risk',
    description: 'The gold standard for cardiovascular risk assessment, established by the 2013 ACC/AHA Guidelines. PCE provides reliable 10-year risk prediction using traditional risk factors.',
    keyFeatures: [
      'Validated across 24,626+ participants',
      'Race and gender-specific calculations',
      'Integrated into clinical guidelines',
      'Proven clinical decision support'
    ],
    technicalDetails: {
      methodology: 'Cox proportional hazards regression with exponential survival functions',
      sampleSize: '24,626 participants from Framingham, ARIC, CHS, and CARDIA cohorts',
      validation: '30+ years of follow-up data across diverse populations',
      accuracy: 'C-statistic: 0.71-0.82 (good discrimination)'
    },
    advantages: [
      'Extensively validated across populations',
      'Standard of care in clinical practice',
      'Simple parameter requirements',
      'Proven outcomes in real-world use'
    ],
    limitations: [
      'Limited to 10-year predictions',
      'Age restrictions (40-79 years)',
      'Does not include kidney function',
      'May underestimate risk in some groups'
    ],
    clinicalUse: 'Recommended for standard primary prevention risk assessment and statin therapy decisions.'
  },
  {
    id: 'PREVENT',
    name: 'PREVENT',
    fullName: 'Predicting Risk of CVD EVENTs',
    year: 2024,
    ageRange: '30-79 years',
    timeline: '10-year & 30-year risk',
    description: 'The most advanced cardiovascular risk prediction algorithm, incorporating kidney function and social determinants for enhanced accuracy and longer-term predictions.',
    keyFeatures: [
      'Dual timeline predictions (10 & 30-year)',
      'Includes kidney function (eGFR)',
      'Enhanced cholesterol assessment',
      'Social determinants integration',
      'Broader age range (30-79 years)'
    ],
    technicalDetails: {
      methodology: 'Enhanced Cox regression with contemporary risk factors and kidney function integration',
      sampleSize: '3.5+ million participants from contemporary, diverse populations (2013-2018)',
      validation: '8+ years follow-up with external validation across multiple health systems',
      accuracy: 'C-statistic: 0.73-0.85 (superior discrimination, especially in younger adults)'
    },
    advantages: [
      'More comprehensive risk factor assessment',
      'Longer-term predictions (30-year)',
      'Better performance in younger adults',
      'Includes kidney disease impact',
      'Contemporary population data'
    ],
    limitations: [
      'Newer algorithm with less long-term validation',
      'More complex parameter requirements',
      'May not be in all clinical guidelines yet',
      'Requires additional laboratory values'
    ],
    clinicalUse: 'Ideal for comprehensive risk assessment, younger adults, patients with kidney disease, and precision medicine approaches.'
  }
];

const AlgorithmComparisonSection: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'PCE' | 'PREVENT'>('PREVENT');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showClinicalEvidence, setShowClinicalEvidence] = useState(false);

  const filteredAlgorithms = ALGORITHM_DATA.filter(alg => alg.id === selectedAlgorithm);

  return (
    <div className="space-y-8">
      {/* Algorithm Selection Tabs - Mobile Responsive */}
      <div className="flex justify-center px-4">
        <div className="flex flex-col sm:flex-row items-center gap-1 bg-gray-100 rounded-lg p-1 w-full max-w-md sm:max-w-none">
          {(['PCE', 'PREVENT'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAlgorithm(option)}
              className={`w-full sm:w-auto px-4 sm:px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedAlgorithm === option
                  ? 'bg-white text-prediction-700 shadow-sm ring-1 ring-prediction-200'
                  : 'text-neutral-600 hover:text-prediction-600'
              }`}
            >
              <span className="block sm:inline">{option}</span>
              <span className="block sm:inline text-xs sm:ml-1 text-neutral-500">
                {option === 'PCE' ? '(2013)' : '(2024)'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Overview Cards - Mobile Responsive */}
      <div className="grid gap-6 lg:gap-8 max-w-2xl mx-auto">
        {filteredAlgorithms.map((algorithm) => (
          <div
            key={algorithm.id}
            className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {algorithm.name} ({algorithm.year})
                </h3>
                <p className="text-lg text-prediction-600 font-medium mb-1">
                  {algorithm.fullName}
                </p>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-sm text-neutral-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {algorithm.timeline}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {algorithm.ageRange}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                algorithm.id === 'PCE' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-700 leading-relaxed mb-6">
              {algorithm.description}
            </p>

            {/* Key Features */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-neutral-900 mb-3">Key Features</h4>
              <ul className="space-y-2">
                {algorithm.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 text-prediction-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Use */}
            <div className="bg-gradient-to-r from-prediction-50 to-intelligence-50 p-4 rounded-lg border border-prediction-200">
              <h4 className="text-sm font-semibold text-prediction-900 mb-2">Best For</h4>
              <p className="text-sm text-prediction-800 leading-relaxed">
                {algorithm.clinicalUse}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progressive Disclosure Sections */}
      <div className="space-y-4">
        {/* Technical Architecture & Implementation */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center min-w-0 flex-1">
              <svg className="w-5 h-5 mr-2 sm:mr-3 text-precision-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-base sm:text-lg font-semibold text-neutral-900">Technical Architecture & Implementation</span>
                <p className="text-sm text-neutral-600 mt-1">Algorithm methodology and privacy-first technical design</p>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-neutral-400 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showTechnicalDetails && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
              {/* Privacy-First Technical Architecture Section */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-neutral-50 to-prediction-50/30 p-6 rounded-lg border border-neutral-200">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 mr-3 text-neutral-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-xl font-semibold text-neutral-900">Privacy-First Technical Architecture</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-neutral-200">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-neutral-900 ml-3">Client-Side Processing</h5>
                      </div>
                      <p className="text-sm text-neutral-600">
                        All calculations execute in-browser using optimized TypeScript. Zero server communication for health data ensures complete privacy.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-neutral-200">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-neutral-900 ml-3">Local Storage Only</h5>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Patient data persists in browser localStorage with automatic cleanup. HIPAA-compliant by design with no external data transmission.
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-neutral-200">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-neutral-900 ml-3">Open Source Algorithms</h5>
                      </div>
                      <p className="text-sm text-neutral-600">
                        Complete implementation transparency with peer-reviewable code and clinical validation references available for audit.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-neutral-200">
                    <h5 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Privacy & Security Commitment
                    </h5>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      Bioprognostika is designed with privacy-first principles. Your health data never leaves your device, 
                      all calculations happen locally in your browser, and we maintain complete transparency in our algorithms. 
                      This approach ensures your sensitive health information remains completely private while providing 
                      clinical-grade risk assessment capabilities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Implementation Details for privacy/architecture only */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-neutral-900 mb-4">Implementation Architecture</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium text-neutral-900">Frontend Framework:</span>
                    <p className="text-neutral-700 mt-1">React 18 with TypeScript for type-safe medical calculations</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-900">Algorithm Implementation:</span>
                    <p className="text-neutral-700 mt-1">Pure TypeScript implementations of both PCE and PREVENT equations with evidence-based coefficients</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-900">Data Processing:</span>
                    <p className="text-neutral-700 mt-1">Client-side only - all calculations execute in browser with zero server communication</p>
                  </div>
                  <div>
                    <span className="font-medium text-neutral-900">Validation Framework:</span>
                    <p className="text-neutral-700 mt-1">Comprehensive input validation with medical range checking and error handling</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clinical Evidence and Research Foundation */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowClinicalEvidence(!showClinicalEvidence)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="text-lg font-semibold text-neutral-900">Clinical Evidence & Research Foundation</span>
                <p className="text-sm text-neutral-600 mt-1">Algorithm validation and evidence-based intervention modeling</p>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-neutral-400 transition-transform ${showClinicalEvidence ? 'rotate-180' : ''}`}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showClinicalEvidence && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              {/* Evidence-Based Intervention Modeling Section */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-intelligence-50 to-healing-50 p-6 rounded-lg border border-intelligence-200">
                  <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 mr-3 text-intelligence-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-xl font-semibold text-intelligence-900">Evidence-Based Intervention Modeling</h4>
                  </div>
                  
                  <p className="medical-content text-neutral-700 mb-6">
                    Our "what-if" scenarios apply{' '}
                    <CitationTooltip referenceId="evidence-based-interventions">
                      <span className="underline decoration-dotted">evidence-based risk reduction factors from meta-analyses and randomized controlled trials</span>
                    </CitationTooltip>. Each intervention modifies baseline risk calculations using clinically validated effect sizes.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-neutral-900">Smoking Cessation</h5>
                      </div>
                      <p className="text-sm text-neutral-600">
                        <CitationTooltip referenceId="smoking-cessation-rr">
                          <span className="underline decoration-dotted font-semibold text-green-700">35% risk reduction</span>
                        </CitationTooltip><br />
                        <span className="text-xs text-neutral-500">Within 1-2 years</span>
                      </p>
                      <ReferenceBadge referenceId="smoking-cessation-rr" size="sm" className="mt-2" />
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-neutral-900">BP Management</h5>
                      </div>
                      <p className="text-sm text-neutral-600">
                        <CitationTooltip referenceId="bp-reduction-rr">
                          <span className="underline decoration-dotted font-semibold text-green-700">22% per 10mmHg</span>
                        </CitationTooltip><br />
                        <span className="text-xs text-neutral-500">Reduction in events</span>
                      </p>
                      <ReferenceBadge referenceId="bp-reduction-rr" size="sm" className="mt-2" />
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-neutral-900">Physical Activity</h5>
                      </div>
                      <p className="text-sm text-neutral-600">
                        <CitationTooltip referenceId="physical-activity-rr">
                          <span className="underline decoration-dotted font-semibold text-green-700">25% risk reduction</span>
                        </CitationTooltip><br />
                        <span className="text-xs text-neutral-500">Regular exercise</span>
                      </p>
                      <ReferenceBadge referenceId="physical-activity-rr" size="sm" className="mt-2" />
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-neutral-900">Statin Therapy</h5>
                      </div>
                      <p className="text-sm text-neutral-600">
                        <CitationTooltip referenceId="statin-therapy-rr">
                          <span className="underline decoration-dotted font-semibold text-green-700">25% risk reduction</span>
                        </CitationTooltip><br />
                        <span className="text-xs text-neutral-500">With appropriate use</span>
                      </p>
                      <ReferenceBadge referenceId="statin-therapy-rr" size="sm" className="mt-2" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-intelligence-200">
                    <h5 className="text-sm font-semibold text-intelligence-900 mb-2">Intervention Modeling</h5>
                    <p className="text-sm text-intelligence-800 leading-relaxed">
                      Each intervention is modeled using clinically validated effect sizes from large-scale studies. 
                      The calculator shows both individual and combined effects of multiple interventions to help 
                      you understand the potential impact of lifestyle changes on your cardiovascular health.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 max-w-2xl mx-auto">
                {filteredAlgorithms.map((algorithm) => (
                  <div key={algorithm.id} className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        algorithm.id === 'PCE' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}></span>
                      {algorithm.name} Clinical Evidence & Methodology
                    </h4>
                    
                    {/* Technical Methodology Details */}
                    <div className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50/30 p-4 rounded-lg border border-gray-200">
                      <h5 className="text-sm font-semibold text-neutral-900 mb-3">Research Methodology & Validation</h5>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-neutral-900">Statistical Methodology:</span>
                          <p className="text-neutral-700 mt-1">{algorithm.technicalDetails.methodology}</p>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">Study Population:</span>
                          <p className="text-neutral-700 mt-1">{algorithm.technicalDetails.sampleSize}</p>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">Clinical Validation:</span>
                          <p className="text-neutral-700 mt-1">{algorithm.technicalDetails.validation}</p>
                        </div>
                        <div>
                          <span className="font-medium text-neutral-900">Predictive Accuracy:</span>
                          <p className="text-neutral-700 mt-1">{algorithm.technicalDetails.accuracy}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Clinical Advantages */}
                    <div className="mb-4">
                      <h5 className="text-sm font-semibold text-green-800 mb-2">Clinical Advantages</h5>
                      <ul className="space-y-1">
                        {algorithm.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <span className="w-1 h-1 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0" />
                            <span className="text-neutral-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Clinical Limitations */}
                    <div>
                      <h5 className="text-sm font-semibold text-amber-800 mb-2">Clinical Limitations</h5>
                      <ul className="space-y-1">
                        {algorithm.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <span className="w-1 h-1 rounded-full bg-amber-500 mt-2 mr-2 flex-shrink-0" />
                            <span className="text-neutral-700">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Selection Guide - Mobile Responsive */}
              <div className="mt-4 sm:mt-6 p-4 bg-gradient-to-r from-prediction-50 to-intelligence-50 rounded-lg border border-prediction-200">
                <h5 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3">Which Algorithm Should You Choose?</h5>
                <div className="grid gap-4 lg:grid-cols-2 text-sm">
                  <div className="bg-white p-3 sm:p-4 rounded border border-blue-200">
                    <h6 className="font-semibold text-blue-900 mb-2">Choose PCE if you:</h6>
                    <ul className="space-y-1 text-neutral-700 text-xs sm:text-sm">
                      <li>• Need standard clinical risk assessment</li>
                      <li>• Are following established clinical guidelines</li>
                      <li>• Have basic lab values (age 40-79)</li>
                      <li>• Want the proven "gold standard" approach</li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded border border-purple-200">
                    <h6 className="font-semibold text-purple-900 mb-2">Choose PREVENT if you:</h6>
                    <ul className="space-y-1 text-neutral-700 text-xs sm:text-sm">
                      <li>• Want comprehensive risk assessment</li>
                      <li>• Have kidney function data available</li>
                      <li>• Need long-term (30-year) predictions</li>
                      <li>• Are younger (30-40 years old)</li>
                    </ul>
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

export default AlgorithmComparisonSection;