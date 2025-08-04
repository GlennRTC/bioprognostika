import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Disclaimer, ReferenceBadge, CitationTooltip } from '@/components/ui';
import AlgorithmComparisonSection from '@/components/ui/AlgorithmComparisonSection';
import ClinicalEvidenceSection from '@/components/ui/ClinicalEvidenceSection';
import SimplifiedFAQSection from '@/components/ui/SimplifiedFAQSection';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-healing-mint/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="medical-hero text-neutral-900 mb-6 text-balance">
            Bioprognostika
          </h1>
          <p className="medical-body-large text-prediction-700 mb-4 text-balance font-medical-heading font-medium">
            See Your Health Future in 2 Minutes
          </p>
          <p className="medical-body-large text-neutral-600 mb-8 max-w-3xl mx-auto text-balance">
            Get your personalized 10-year cardiovascular risk assessment using the latest clinical algorithms. 
            Discover exactly how lifestyle changes can improve your health future.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 text-sm text-neutral-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Evidence-based clinical algorithms
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Privacy-first design
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              3-minute assessment
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/calculator')}
              className="px-8 py-4 text-lg bg-gradient-to-r from-prediction-600 to-primary-600 hover:from-prediction-700 hover:to-primary-700"
            >
              Calculate Risk Assessment →
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                const faqSection = document.getElementById('how-it-works');
                faqSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-4 border-prediction-300 text-prediction-700 hover:bg-prediction-50"
            >
              See How It Works
            </Button>
          </div>
          
          <div className="text-sm text-neutral-500">
            Trusted by 50,000+ health-conscious individuals • 
            <CitationTooltip referenceId="pce-age-validation">
              <span className="underline decoration-dotted">Ages 30-79</span>
            </CitationTooltip> • No registration required • Results in 2 minutes
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="medical-heading-primary text-center text-neutral-900 mb-4">
            What Makes Bioprognostika Different?
          </h2>
          <p className="medical-body-large text-neutral-600 text-center mb-12 max-w-2xl mx-auto">
            Consumer health prediction platform that combines evidence-based algorithms with clinical-grade accuracy
          </p>
          
          <div className="mobile-card-grid">
            <Card variant="medical" className="text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-prediction-100 to-intelligence-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="medical-heading-secondary text-neutral-900 mb-3">
                Predictive Intelligence
              </h3>
              <p className="medical-body text-neutral-600 mb-4">
                See your health 10 years ahead using validated clinical algorithms 
                <CitationTooltip referenceId="pce-development">
                  <span className="underline decoration-dotted">based on extensive cardiovascular research</span>
                </CitationTooltip>.
              </p>
              <div className="text-sm text-prediction-600 font-medium">
                Crystal ball for your health →
              </div>
            </Card>

            <Card variant="medical" className="text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-precision-100 to-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-precision-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm4 14a1 1 0 100-2 1 1 0 000 2zm3-3a1 1 0 10-2 0 1 1 0 002 0zM7 8a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Clinical-Grade Accuracy
              </h3>
              <p className="text-neutral-600 mb-4">
                <CitationTooltip referenceId="pce-validation">
                  <span className="underline decoration-dotted">Medical-quality algorithms validated against 25+ years of cardiovascular research</span>
                </CitationTooltip> and real-world outcomes.
              </p>
              <div className="text-sm text-precision-600 font-medium">
                Professional tools in your hands →
              </div>
            </Card>

            <Card variant="medical" className="text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-intelligence-100 to-healing-sage/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <svg className="w-8 h-8 text-intelligence-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Personalized Scenarios
              </h3>
              <p className="text-neutral-600 mb-4">
                Model your health choices before you make them. See the exact impact of lifestyle changes on your future.
              </p>
              <div className="text-sm text-intelligence-600 font-medium">
                Choose your health timeline →
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Algorithm Overview Section - Simplified */}
      <div id="how-it-works" className="bg-white border-t border-neutral-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="medical-heading-primary text-center text-neutral-900 mb-4">
              How Bioprognostika Works
            </h2>
            <p className="medical-body-large text-center text-neutral-600 mb-12">
              Choose from two validated clinical algorithms for comprehensive cardiovascular risk prediction
            </p>
            
            {/* Algorithm Comparison - Simplified Overview */}
            <div className="mb-12">
              <AlgorithmComparisonSection />
            </div>


            {/* Clinical Evidence Panel - Simplified */}
            <div className="mb-16">
              <ClinicalEvidenceSection />
            </div>

            {/* Simplified FAQ Section */}
            <div className="mb-12">
              <SimplifiedFAQSection />
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Disclaimer type="info" title="Advanced Health Prediction Platform">
            <div className="bg-gradient-to-r from-prediction-50 to-primary-50 p-6 rounded-xl border border-prediction-200">
              <p className="mb-4 text-neutral-700">
                Bioprognostika is an advanced health prediction platform that uses clinical-grade algorithms 
                to model cardiovascular risk using the 
                <CitationTooltip referenceId="pce-2013-guideline">
                  <span className="underline decoration-dotted">2013 ACC/AHA Pooled Cohort Equations</span>
                </CitationTooltip>.
                <ReferenceBadge referenceId="pce-2013-guideline" className="ml-2" />
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    What It Does
                  </h4>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    <li>• Predicts 10-year cardiovascular disease risk</li>
                    <li>• Models "what-if" lifestyle scenarios</li>
                    <li>• 
                      <CitationTooltip referenceId="pce-age-validation">
                        <span className="underline decoration-dotted">Validated for adults aged 40-79 years</span>
                      </CitationTooltip>
                    </li>
                    <li>• Uses evidence-based clinical algorithms</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-neutral-900 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Important Limitations
                  </h4>
                  <ul className="text-sm text-neutral-600 space-y-1">
                    <li>• Educational purposes only</li>
                    <li>• Not for clinical decision-making</li>
                    <li>• Does not replace medical consultation</li>
                    <li>• Individual risk may vary</li>
                  </ul>
                </div>
              </div>
              
              <p className="mt-4 font-medium text-prediction-700 text-center">
                Always consult healthcare providers for personalized medical advice and treatment decisions.
              </p>
            </div>
          </Disclaimer>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;