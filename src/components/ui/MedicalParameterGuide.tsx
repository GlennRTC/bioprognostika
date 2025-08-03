import React, { useState, useEffect } from 'react';
import { ClinicalReference } from '@/types';
import { MEDICAL_PARAMETERS } from './MedicalTooltip';
import ReferenceBadge from './ReferenceBadge';
import ReferenceList from './ReferenceList';

interface MedicalParameterGuideProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  algorithm?: 'PCE' | 'PREVENT' | 'both';
  className?: string;
}

interface ParameterCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  parameters: string[];
  algorithm: 'PCE' | 'PREVENT' | 'both';
  clinicalSignificance: string;
}

const PARAMETER_CATEGORIES: ParameterCategory[] = [
  {
    id: 'demographics',
    title: 'Demographics & Basic Info',
    description: 'Age, gender, and race are fundamental factors that influence cardiovascular risk patterns.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    parameters: ['age', 'gender', 'race'],
    algorithm: 'both',
    clinicalSignificance: 'Demographics provide the foundation for risk calculation as cardiovascular disease patterns vary significantly across age groups, genders, and racial populations based on extensive epidemiological data.'
  },
  {
    id: 'cardiovascular',
    title: 'Cardiovascular Measurements',
    description: 'Blood pressure and heart-related measurements that directly indicate cardiovascular health.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    parameters: ['systolicBP', 'diastolicBP', 'bpMedication'],
    algorithm: 'both',
    clinicalSignificance: 'Blood pressure is one of the strongest predictors of cardiovascular events. Even mild elevations significantly increase risk, making BP management a cornerstone of cardiovascular prevention.'
  },
  {
    id: 'lipids',
    title: 'Cholesterol & Lipids',
    description: 'Blood lipid measurements that assess atherosclerotic risk factors.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
      </svg>
    ),
    parameters: ['totalCholesterol', 'hdlCholesterol', 'nonHdlCholesterol', 'statinUse'],
    algorithm: 'both',
    clinicalSignificance: 'Lipid abnormalities are major drivers of atherosclerosis. Non-HDL cholesterol (PREVENT) provides better risk prediction than LDL alone by capturing all atherogenic particles.'
  },
  {
    id: 'kidney',
    title: 'Kidney Function',
    description: 'Kidney function parameters that significantly impact cardiovascular risk.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    parameters: ['eGFR', 'creatinine', 'albuminCreatinineRatio'],
    algorithm: 'PREVENT',
    clinicalSignificance: 'Reduced kidney function is a powerful, independent predictor of cardiovascular events. Even mild kidney dysfunction (eGFR 60-90) increases CV risk by 40-60%.'
  },
  {
    id: 'metabolic',
    title: 'Metabolic Factors',
    description: 'Diabetes-related measurements and metabolic health indicators.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    parameters: ['diabetes', 'hba1c'],
    algorithm: 'both',
    clinicalSignificance: 'Diabetes doubles cardiovascular risk. HbA1c provides objective measurement of glycemic control, with each 1% increase associated with 18% higher CV risk.'
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Social Factors',
    description: 'Modifiable risk factors and social determinants that influence cardiovascular health.',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z" clipRule="evenodd" />
      </svg>
    ),
    parameters: ['smoking', 'socialDeprivationIndex', 'weight', 'height'],
    algorithm: 'both',
    clinicalSignificance: 'Lifestyle factors are highly modifiable and offer significant opportunities for risk reduction. Social determinants increasingly recognized as major drivers of health outcomes.'
  }
];

// Additional references specific to parameter understanding
const GUIDE_REFERENCES: ClinicalReference[] = [
  {
    id: 'acc-aha-bp',
    authors: 'Whelton PK, Carey RM, Aronow WS, et al.',
    title: '2017 ACC/AHA/AAPA/ABC/ACPM/AGS/APhA/ASH/ASPC/NMA/PCNA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults',
    journal: 'Hypertension',
    year: 2018,
    pmid: '29133356',
    summary: 'Comprehensive blood pressure guidelines defining normal ranges and treatment targets'
  },
  {
    id: 'kdigo-ckd',
    authors: 'Stevens PE, Levin A, for Kidney Disease: Improving Global Outcomes Chronic Kidney Disease Guideline Development Work Group Members',
    title: 'Evaluation and management of chronic kidney disease',
    journal: 'Ann Intern Med',
    year: 2013,
    pmid: '23896629',
    summary: 'International guidelines for kidney function assessment and CKD classification'
  }
];

const MedicalParameterGuide: React.FC<MedicalParameterGuideProps> = ({
  isOpen,
  onClose,
  initialCategory,
  algorithm = 'both',
  className = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'demographics');
  const [searchTerm, setSearchTerm] = useState('');

  // Set initial category when prop changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter categories based on algorithm
  const filteredCategories = PARAMETER_CATEGORIES.filter(cat => 
    algorithm === 'both' || cat.algorithm === 'both' || cat.algorithm === algorithm
  );

  const activeTab = filteredCategories.find(cat => cat.id === activeCategory) || filteredCategories[0];

  // Get parameters for active category
  const getParametersForCategory = (category: ParameterCategory) => {
    return category.parameters
      .map(paramKey => ({
        key: paramKey,
        data: MEDICAL_PARAMETERS[paramKey as keyof typeof MEDICAL_PARAMETERS]
      }))
      .filter(param => param.data) // Only include parameters we have data for
      .filter(param => 
        searchTerm === '' || 
        param.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        param.data.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const activeParameters = getParametersForCategory(activeTab);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-50 overflow-y-auto ${className}`}>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-prediction-50 to-intelligence-50">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Medical Parameter Guide
                </h2>
                <p className="text-sm text-prediction-700 mt-1">
                  Comprehensive guide to understanding cardiovascular risk factors
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Close guide"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row h-96 lg:h-[600px]">
              {/* Sidebar - Categories */}
              <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
                <div className="p-4">
                  {/* Search */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search parameters..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prediction-500 focus:border-transparent"
                    />
                    <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* Algorithm Filter */}
                  {algorithm === 'both' && (
                    <div className="mb-4">
                      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                        Viewing: Both PCE & PREVENT
                      </span>
                    </div>
                  )}

                  {/* Category List */}
                  <div className="space-y-1">
                    {filteredCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setSearchTerm(''); // Clear search when switching categories
                        }}
                        className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors ${
                          activeCategory === category.id
                            ? 'bg-prediction-100 text-prediction-900 border border-prediction-200'
                            : 'hover:bg-gray-100 text-neutral-700'
                        }`}
                      >
                        <div className={`${
                          activeCategory === category.id ? 'text-prediction-600' : 'text-neutral-500'
                        }`}>
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{category.title}</p>
                          <p className="text-xs text-neutral-600 mt-0.5">
                            {category.parameters.length} parameters
                          </p>
                        </div>
                        {category.algorithm !== 'both' && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            category.algorithm === 'PREVENT' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {category.algorithm}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Category Header */}
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-prediction-600">
                        {activeTab.icon}
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900">
                        {activeTab.title}
                      </h3>
                    </div>
                    <p className="text-neutral-700 mb-4">
                      {activeTab.description}
                    </p>
                    <div className="p-4 bg-prediction-50 rounded-lg border border-prediction-200">
                      <h4 className="text-sm font-semibold text-prediction-900 mb-2">
                        Clinical Significance
                      </h4>
                      <p className="text-sm text-prediction-800">
                        {activeTab.clinicalSignificance}
                      </p>
                    </div>
                  </div>

                  {/* Parameters */}
                  {activeParameters.length > 0 ? (
                    <div className="space-y-4">
                      {activeParameters.map(({ key, data }) => (
                        <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-lg font-semibold text-neutral-900">
                              {data.name}
                            </h4>
                            {data.unit && (
                              <span className="text-sm text-prediction-600 font-medium bg-prediction-100 px-2 py-1 rounded">
                                {data.unit}
                              </span>
                            )}
                          </div>

                          <p className="text-neutral-700 mb-3 leading-relaxed">
                            {data.description}
                          </p>

                          {/* Normal Range */}
                          {data.normalRange && (
                            <div className="mb-3 p-3 bg-green-50 rounded border border-green-200">
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium text-green-800">Normal Range:</span>
                                <span className="text-sm text-green-700">{data.normalRange}</span>
                              </div>
                            </div>
                          )}

                          {/* Warning Thresholds */}
                          {data.warningThresholds && (
                            <div className="mb-3 p-3 bg-amber-50 rounded border border-amber-200">
                              <div className="flex items-start space-x-2">
                                <svg className="w-4 h-4 mt-0.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div>
                                  <span className="text-sm font-medium text-amber-800">Clinical Alert:</span>
                                  <p className="text-sm text-amber-700 mt-1">{data.warningThresholds.message}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Clinical Significance */}
                          <div className="p-3 bg-blue-50 rounded border border-blue-200">
                            <h5 className="text-sm font-semibold text-blue-900 mb-1">Clinical Significance</h5>
                            <p className="text-sm text-blue-800 leading-relaxed">
                              {data.clinicalSignificance}
                            </p>
                          </div>

                          {/* References for this parameter */}
                          {data.references && data.references.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex flex-wrap gap-2">
                                {data.references.map((ref) => (
                                  <ReferenceBadge key={ref.id} referenceId={ref.id} variant="small" />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                      <p className="text-neutral-600">
                        No parameters found matching "{searchTerm}"
                      </p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-prediction-600 hover:text-prediction-800 font-medium"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-600">
                  Understanding these parameters helps you make informed health decisions
                </div>
                <div className="flex items-center space-x-2">
                  {GUIDE_REFERENCES.slice(0, 2).map((ref) => (
                    <ReferenceBadge key={ref.id} referenceId={ref.id} variant="small" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalParameterGuide;