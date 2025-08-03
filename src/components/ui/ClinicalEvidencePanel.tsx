import React, { useState } from 'react';
import { ClinicalReference } from '@/types';
import ReferenceBadge from './ReferenceBadge';
import ReferenceList from './ReferenceList';
import MedicalTooltip from './MedicalTooltip';

interface ClinicalEvidencePanelProps {
  className?: string;
  showFullReferences?: boolean;
}

interface EvidenceSection {
  id: string;
  title: string;
  description: string;
  keyFindings: string[];
  statisticalEvidence: {
    sampleSize?: string;
    studyDuration?: string;
    cStatistic?: string;
    validationCohorts?: string[];
    primaryEndpoint?: string;
  };
  clinicalImpact: string;
  references: ClinicalReference[];
  algorithmSpecific?: 'PCE' | 'PREVENT' | 'both';
}

// Comprehensive clinical evidence database
const EVIDENCE_SECTIONS: EvidenceSection[] = [
  {
    id: 'pce-development',
    title: 'Pooled Cohort Equations Development',
    description: 'The PCE were developed using data from multiple large, diverse cohort studies to create race- and sex-specific equations for 10-year ASCVD risk prediction.',
    keyFindings: [
      'Derived from 24,626 participants across four major epidemiological studies',
      'Validated across diverse racial and ethnic populations',
      'C-statistic range of 0.71-0.82 demonstrating good discrimination',
      'Superior performance compared to Framingham Risk Score in contemporary populations'
    ],
    statisticalEvidence: {
      sampleSize: '24,626 participants',
      studyDuration: '12+ years follow-up',
      cStatistic: '0.71-0.82',
      validationCohorts: ['ARIC', 'CHS', 'CARDIA', 'Framingham'],
      primaryEndpoint: 'First hard ASCVD event (CHD death, MI, stroke)'
    },
    clinicalImpact: 'Established as the standard for primary prevention risk assessment in the 2013 ACC/AHA Guidelines, influencing statin therapy decisions for millions of patients.',
    references: [
      {
        id: 'goff-2014',
        authors: 'Goff DC Jr, Lloyd-Jones DM, Bennett G, et al.',
        title: '2013 ACC/AHA Guideline on the Assessment of Cardiovascular Risk',
        journal: 'Circulation',
        year: 2014,
        pmid: '24222018',
        doi: '10.1161/01.cir.0000437741.48606.98',
        summary: 'Landmark clinical guideline establishing PCE as the standard for ASCVD risk assessment in primary prevention'
      },
      {
        id: 'muntner-2014',
        authors: 'Muntner P, Colantonio LD, Cushman M, et al.',
        title: 'Validation of the atherosclerotic cardiovascular disease Pooled Cohort risk equations',
        journal: 'JAMA',
        year: 2014,
        pmid: '24825642',
        doi: '10.1001/jama.2014.2630',
        summary: 'External validation study confirming PCE accuracy across diverse populations'
      }
    ],
    algorithmSpecific: 'PCE'
  },
  {
    id: 'prevent-development',
    title: 'PREVENT Equations Development',
    description: 'The PREVENT equations represent a contemporary update to cardiovascular risk prediction, incorporating kidney function and providing both 10-year and 30-year risk estimates.',
    keyFindings: [
      'Developed using contemporary, diverse population data from 2013-2018',
      'Incorporates estimated glomerular filtration rate (eGFR) as a key predictor',
      'Provides both 10-year and 30-year risk predictions',
      'Improved discrimination over PCE, particularly in younger adults and those with kidney disease',
      'Enhanced representation of contemporary risk factor distributions'
    ],
    statisticalEvidence: {
      sampleSize: '3.5+ million participants',
      studyDuration: '8+ years follow-up',
      cStatistic: '0.73-0.85',
      validationCohorts: ['Multiple contemporary cohorts', 'Electronic health records', 'Population surveys'],
      primaryEndpoint: 'First ASCVD event (MI, stroke, heart failure, AFib)'
    },
    clinicalImpact: 'Addresses limitations of PCE by including kidney function and providing longer-term risk prediction, particularly valuable for younger adults and precision medicine approaches.',
    references: [
      {
        id: 'khan-2024',
        authors: 'Khan SS, Matsushita K, Sang Y, et al.',
        title: 'Development and Validation of the American Heart Association\'s PREVENT Equations',
        journal: 'Circulation',
        year: 2024,
        pmid: '38440987',
        doi: '10.1161/CIRCULATIONAHA.123.067626',
        summary: 'Primary development and validation paper for the PREVENT equations, demonstrating improved risk prediction'
      }
    ],
    algorithmSpecific: 'PREVENT'
  },
  {
    id: 'kidney-function-risk',
    title: 'Kidney Function and Cardiovascular Risk',
    description: 'Extensive evidence demonstrates that reduced kidney function significantly increases cardiovascular disease risk, independent of traditional risk factors.',
    keyFindings: [
      'eGFR <60 mL/min/1.73m² associated with 40-60% increased CV risk',
      'Linear relationship between declining eGFR and increasing CV events',
      'Kidney disease often precedes clinical cardiovascular disease',
      'Albuminuria further amplifies cardiovascular risk beyond eGFR alone'
    ],
    statisticalEvidence: {
      sampleSize: '1.2+ million participants (meta-analyses)',
      studyDuration: 'Up to 20 years follow-up',
      cStatistic: 'Improves model discrimination by 0.02-0.05',
      validationCohorts: ['CKD-PC', 'Multiple international cohorts'],
      primaryEndpoint: 'CV death, MI, stroke, heart failure'
    },
    clinicalImpact: 'Led to recognition of CKD as a major cardiovascular risk factor and incorporation of eGFR into contemporary risk prediction models.',
    references: [
      {
        id: 'matsushita-2010',
        authors: 'Matsushita K, van der Velde M, Astor BC, et al.',
        title: 'Association of estimated glomerular filtration rate and albuminuria with all-cause and cardiovascular mortality',
        journal: 'Lancet',
        year: 2010,
        pmid: '20483451',
        doi: '10.1016/S0140-6736(10)60674-5',
        summary: 'Large collaborative meta-analysis establishing the independent association between kidney function and cardiovascular risk'
      }
    ],
    algorithmSpecific: 'PREVENT'
  },
  {
    id: 'social-determinants',
    title: 'Social Determinants of Health',
    description: 'Growing evidence demonstrates that social and economic factors significantly impact cardiovascular health outcomes, independent of traditional clinical risk factors.',
    keyFindings: [
      'Social deprivation index independently predicts cardiovascular events',
      'Neighborhood-level factors affect individual health outcomes',
      'Income, education, and housing quality influence CV risk',
      'Social determinants can modify the effectiveness of clinical interventions'
    ],
    statisticalEvidence: {
      sampleSize: 'Population-based studies (millions)',
      studyDuration: 'Longitudinal follow-up 5-15 years',
      cStatistic: 'Modest improvement in model discrimination',
      validationCohorts: ['Census-linked cohorts', 'EHR-based studies'],
      primaryEndpoint: 'CV mortality and morbidity'
    },
    clinicalImpact: 'Increasingly recognized as essential for precision medicine and health equity, leading to integration into contemporary risk assessment tools.',
    references: [
      {
        id: 'havranek-2015',
        authors: 'Havranek EP, Mujahid MS, Barr DA, et al.',
        title: 'Social Determinants of Risk and Outcomes for Cardiovascular Disease: A Scientific Statement From the American Heart Association',
        journal: 'Circulation',
        year: 2015,
        pmid: '26085055',
        doi: '10.1161/CIR.0000000000000228',
        summary: 'Comprehensive scientific statement establishing the importance of social determinants in cardiovascular health'
      }
    ],
    algorithmSpecific: 'PREVENT'
  },
  {
    id: 'intervention-evidence',
    title: 'Evidence-Based Risk Reduction Interventions',
    description: 'Multiple randomized controlled trials and meta-analyses have established the effectiveness of lifestyle and pharmacological interventions for cardiovascular risk reduction.',
    keyFindings: [
      'Statin therapy reduces major vascular events by ~25% per 1.0 mmol/L LDL reduction',
      'Blood pressure reduction of 10 mmHg systolic reduces CV events by ~20%',
      'Smoking cessation reduces CV risk by 35-50% within 1-2 years',
      'Physical activity reduces CV mortality by 20-30%',
      'Mediterranean diet reduces major CV events by 30%'
    ],
    statisticalEvidence: {
      sampleSize: 'Meta-analyses: 100,000+ participants each',
      studyDuration: 'RCT follow-up: 2-7 years typical',
      cStatistic: 'N/A (intervention studies)',
      validationCohorts: ['Multiple international RCTs', 'Meta-analyses'],
      primaryEndpoint: 'Major vascular events (MI, stroke, CV death)'
    },
    clinicalImpact: 'Forms the evidence base for clinical guidelines and the "what-if" intervention modeling in risk calculators.',
    references: [
      {
        id: 'ctt-2010',
        authors: 'Cholesterol Treatment Trialists\' (CTT) Collaboration',
        title: 'Efficacy and safety of more intensive lowering of LDL cholesterol',
        journal: 'Lancet',
        year: 2010,
        pmid: '21067804',
        doi: '10.1016/S0140-6736(10)61350-5',
        summary: 'Landmark meta-analysis of statin trials establishing dose-response relationship for LDL reduction and CV benefit'
      },
      {
        id: 'ettehad-2016',
        authors: 'Ettehad D, Emdin CA, Kiran A, et al.',
        title: 'Blood pressure lowering for prevention of cardiovascular disease and death',
        journal: 'Lancet',
        year: 2016,
        pmid: '26724178',
        doi: '10.1016/S0140-6736(15)01225-8',
        summary: 'Comprehensive meta-analysis quantifying cardiovascular benefits of blood pressure reduction'
      }
    ],
    algorithmSpecific: 'both'
  }
];

const ClinicalEvidencePanel: React.FC<ClinicalEvidencePanelProps> = ({
  className = '',
  showFullReferences = true
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'all' | 'PCE' | 'PREVENT'>('all');

  const filteredSections = EVIDENCE_SECTIONS.filter(section => 
    selectedAlgorithm === 'all' || 
    section.algorithmSpecific === selectedAlgorithm || 
    section.algorithmSpecific === 'both'
  );

  const getAllReferences = (): ClinicalReference[] => {
    const allRefs: ClinicalReference[] = [];
    filteredSections.forEach(section => {
      section.references.forEach(ref => {
        if (!allRefs.find(r => r.id === ref.id)) {
          allRefs.push(ref);
        }
      });
    });
    return allRefs.sort((a, b) => b.year - a.year);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neutral-900 mb-4">
          Clinical Evidence Foundation
        </h2>
        <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-6">
          Our cardiovascular risk prediction is built on decades of rigorous clinical research, 
          validated across millions of participants worldwide.
        </p>
        
        {/* Algorithm Filter */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {(['all', 'PCE', 'PREVENT'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedAlgorithm(filter)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedAlgorithm === filter
                    ? 'bg-white text-prediction-700 shadow-sm'
                    : 'text-neutral-600 hover:text-prediction-600'
                }`}
              >
                {filter === 'all' ? 'All Evidence' : `${filter} Specific`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Quality Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900 ml-3">High-Quality Evidence</h3>
          </div>
          <p className="text-sm text-green-800 mb-3">
            Based on Level 1 evidence from large-scale, prospective cohort studies and randomized controlled trials.
          </p>
          <div className="text-xs text-green-700 space-y-1">
            <p>• Multi-million participant datasets</p>
            <p>• 10+ years follow-up duration</p>
            <p>• Peer-reviewed publications</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-prediction-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-prediction-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-prediction-900 ml-3">Clinical Validation</h3>
          </div>
          <p className="text-sm text-prediction-800 mb-3">
            Extensively validated across diverse populations and clinical settings worldwide.
          </p>
          <div className="text-xs text-prediction-700 space-y-1">
            <p>• Multiple independent validations</p>
            <p>• Diverse racial/ethnic populations</p>
            <p>• International clinical guidelines</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-intelligence-50 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-intelligence-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-intelligence-900 ml-3">Continuous Innovation</h3>
          </div>
          <p className="text-sm text-intelligence-800 mb-3">
            Algorithms continuously refined with new data and contemporary populations.
          </p>
          <div className="text-xs text-intelligence-700 space-y-1">
            <p>• Contemporary risk factor trends</p>
            <p>• Enhanced precision medicine</p>
            <p>• Emerging risk factors integration</p>
          </div>
        </div>
      </div>

      {/* Evidence Sections */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div
              className="p-6 cursor-pointer"
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-neutral-900">
                      {section.title}
                    </h3>
                    {section.algorithmSpecific && section.algorithmSpecific !== 'both' && (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        section.algorithmSpecific === 'PCE' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {section.algorithmSpecific}
                      </span>
                    )}
                    <div className="flex items-center space-x-1">
                      {section.references.map((ref) => (
                        <ReferenceBadge key={ref.id} referenceId={ref.id} variant="small" />
                      ))}
                    </div>
                  </div>
                  <p className="text-neutral-700 leading-relaxed">
                    {section.description}
                  </p>
                </div>
                <svg 
                  className={`w-6 h-6 text-neutral-400 ml-4 transition-transform ${
                    activeSection === section.id ? 'rotate-180' : ''
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {activeSection === section.id && (
              <div className="border-t border-gray-200 bg-gray-50">
                <div className="p-6 space-y-6">
                  {/* Key Findings */}
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-3">Key Findings</h4>
                    <ul className="space-y-2">
                      {section.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-4 h-4 text-prediction-500 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-neutral-700">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Statistical Evidence */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-3">Statistical Evidence</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(section.statisticalEvidence).map(([key, value]) => {
                        if (!value) return null;
                        return (
                          <div key={key} className="flex justify-between items-center py-1">
                            <span className="text-sm text-neutral-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-sm font-medium text-neutral-900">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clinical Impact */}
                  <div className="bg-gradient-to-r from-prediction-50 to-intelligence-50 p-4 rounded-lg border border-prediction-200">
                    <h4 className="text-lg font-semibold text-prediction-900 mb-2">Clinical Impact</h4>
                    <p className="text-sm text-prediction-800 leading-relaxed">
                      {section.clinicalImpact}
                    </p>
                  </div>

                  {/* Section References */}
                  <div>
                    <ReferenceList
                      references={section.references}
                      title="Section References"
                      showLinks={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Complete Reference List */}
      {showFullReferences && (
        <div className="bg-gradient-to-r from-neutral-50 to-prediction-50/30 p-8 rounded-xl border border-neutral-200">
          <ReferenceList
            references={getAllReferences()}
            title="Complete Clinical Reference Library"
            showLinks={true}
            className="bg-transparent border-0 p-0"
          />
          
          <div className="mt-6 p-4 bg-white rounded-lg border border-prediction-200">
            <h5 className="text-sm font-semibold text-prediction-900 mb-2">Research Transparency</h5>
            <p className="text-sm text-prediction-800 leading-relaxed">
              All algorithms and clinical evidence used in Bioprognostika are based on peer-reviewed, 
              published research. We maintain full transparency in our methodological approach and 
              encourage users to review the primary literature for detailed understanding.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalEvidencePanel;