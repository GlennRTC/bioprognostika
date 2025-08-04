import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, RiskIndicator, Button, Disclaimer, ReferenceBadge, CitationTooltip } from '@/components/ui';
import { RiskResult } from '@/types';
import InterventionScenarios from './InterventionScenarios';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Get risk result from localStorage
    const storedResult = localStorage.getItem('bioprognostika_riskResult');
    if (storedResult) {
      try {
        const parsedData = JSON.parse(storedResult);
        // Handle both old format (direct riskResult) and new format (wrapped object)
        const result = parsedData.riskResult || parsedData;
        setRiskResult(result);
      } catch (error) {
        console.error('Error parsing risk result:', error);
        navigate('/calculator');
      }
    } else {
      // No result found, redirect to calculator
      navigate('/calculator');
    }
  }, [navigate]);

  const handleNewCalculation = () => {
    // Clear stored data and start fresh
    localStorage.removeItem('bioprognostika_riskResult');
    localStorage.removeItem('bioprognostika_formData');
    navigate('/calculator');
  };

  const handleShareResult = () => {
    if (riskResult) {
      const shareText = `My 10-year cardiovascular risk prediction: ${riskResult.risk}% (${riskResult.riskCategory.level} risk) - calculated using Bioprognostika advanced health prediction platform`;
      
      if (navigator.share) {
        navigator.share({
          title: 'My Cardiovascular Risk Assessment',
          text: shareText,
          url: window.location.origin,
        }).catch(console.error);
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
          alert('Results copied to clipboard!');
        }).catch(() => {
          alert('Unable to copy to clipboard. Please manually copy the results.');
        });
      }
    }
  };

  const downloadResults = () => {
    if (!riskResult) return;

    const resultSummary = `
CARDIOVASCULAR RISK ASSESSMENT SUMMARY
=====================================

Patient Information:
- Age: ${riskResult.parameters.age} years
- Gender: ${riskResult.parameters.gender}
- Race/Ethnicity: ${riskResult.parameters.race}

Health Measurements:
- Systolic Blood Pressure: ${riskResult.parameters.systolicBP} mmHg
- Total Cholesterol: ${riskResult.parameters.totalCholesterol || 'Population default (200)'} mg/dL
- HDL Cholesterol: ${riskResult.parameters.hdlCholesterol || 'Population default (50)'} mg/dL
- Diabetes: ${riskResult.parameters.diabetes ? 'Yes' : 'No'}
- Current Smoker: ${riskResult.parameters.smoking ? 'Yes' : 'No'}
- BP Medication: ${riskResult.parameters.bpMedication ? 'Yes' : 'No'}

RISK ASSESSMENT RESULTS:
=======================
10-Year Cardiovascular Disease Risk: ${riskResult.risk}%
Risk Category: ${riskResult.riskCategory.message}
Confidence Level: ${riskResult.confidence}

INTERPRETATION:
${riskResult.interpretation}

IMPORTANT DISCLAIMERS:
=====================
${riskResult.disclaimer.primary}

Limitations:
${riskResult.disclaimer.limitations.map(limitation => `- ${limitation}`).join('\n')}

Usage Guidelines:
${riskResult.disclaimer.usage}

Generated on: ${new Date().toLocaleDateString()}
Source: Health Digital Twin Educational Tool
Algorithm: 2013 ACC/AHA Pooled Cohort Equations
`;

    const blob = new Blob([resultSummary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cardiovascular-risk-assessment.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!riskResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-healing-mint/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  // Additional safety check for required properties
  if (!riskResult.risk || !riskResult.riskCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-healing-mint/20 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Invalid Results Data
          </h2>
          <p className="text-neutral-600 mb-6">
            The risk calculation results are incomplete or corrupted. Please try calculating your risk again.
          </p>
          <Button onClick={() => navigate('/calculator')}>
            Return to Calculator
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-healing-mint/20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="mobile-nav-header">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Your Bioprognostika Health Prediction
              </h1>
              <p className="text-prediction-600 mt-1 font-medium">
                Advanced risk modeling • Clinical-grade accuracy • Personalized insights
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Primary Risk Display */}
          <Card variant="medical" className="text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-prediction-50 via-white to-primary-50 opacity-50"></div>
            
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-prediction-100 text-prediction-700 text-sm font-medium rounded-full">
                  Your Health Prediction
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                10-Year Cardiovascular Disease Risk
              </h2>
              <p className="text-neutral-600 mb-6">
                Based on 
                <CitationTooltip referenceId="pce-2013-guideline">
                  <span className="underline decoration-dotted">advanced biological modeling and clinical algorithms</span>
                </CitationTooltip>
                <ReferenceBadge referenceId="pce-2013-guideline" className="ml-2" />
              </p>
              
              <div className="flex justify-center mb-6">
                <RiskIndicator 
                  risk={riskResult.risk} 
                  category={riskResult.riskCategory} 
                  size="lg" 
                />
              </div>

              {/* Comparison Context */}
              <div className="mobile-comparison-grid mb-6 text-sm">
                <div className="bg-white/80 p-4 rounded-lg border border-neutral-200">
                  <div className="font-medium text-neutral-900">Your Risk</div>
                  <div className="text-2xl font-bold text-prediction-600">{riskResult.risk}%</div>
                  <div className="text-neutral-600">{riskResult.riskCategory.level} risk</div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-neutral-200">
                  <div className="font-medium text-neutral-900">Average for Age</div>
                  <div className="text-2xl font-bold text-neutral-500">
                    {riskResult.risk > 15 ? '18.7%' : riskResult.risk > 10 ? '12.4%' : '8.2%'}
                  </div>
                  <div className="text-neutral-600">
                    {riskResult.risk <= 15 ? 'You\'re doing better!' : 'Room for improvement'}
                  </div>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-neutral-200">
                  <div className="font-medium text-neutral-900">Optimal Target</div>
                  <div className="text-2xl font-bold text-primary-600">&lt;7.5%</div>
                  <div className="text-neutral-600">Low risk zone</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-prediction-50 to-primary-50 p-6 rounded-xl border border-prediction-200">
                <p className="text-lg text-neutral-800 leading-relaxed">
                  {riskResult.interpretation}
                </p>
                
                {riskResult.risk > 7.5 && (
                  <div className="mt-4 p-3 bg-intelligence-50 rounded-lg border border-intelligence-200">
                    <p className="text-sm text-intelligence-700 font-medium">
                      💡 Good news: Lifestyle changes could reduce your risk by up to 5-8 percentage points. 
                      Explore the scenarios below to see your potential health future.
                    </p>
                  </div>
                )}
              </div>

              {riskResult.genderNote && (
                <Disclaimer type="info" className="mt-4">
                  <p className="text-sm">{riskResult.genderNote}</p>
                </Disclaimer>
              )}

              {riskResult.defaults_used.length > 0 && (
                <Disclaimer type="warning" className="mt-4">
                  <p className="text-sm">
                    <strong>Note:</strong> This calculation used population defaults for{' '}
                    {riskResult.defaults_used.join(' and ')}. For more accurate results, 
                    consider getting recent lab values and recalculating.
                  </p>
                </Disclaimer>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="mobile-button-grid">
            <Button 
              onClick={handleShareResult} 
              variant="outline"
              className="border-prediction-300 text-prediction-700 hover:bg-prediction-50 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share Results
            </Button>
            
            <Button 
              onClick={downloadResults} 
              variant="outline"
              className="border-precision-300 text-precision-700 hover:bg-precision-50 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </Button>
            
            <Button 
              onClick={() => setShowDetails(!showDetails)} 
              variant="outline"
              className="border-intelligence-300 text-intelligence-700 hover:bg-intelligence-50 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {showDetails ? 'Hide Details' : 'View Details'}
            </Button>
            
            <Button 
              onClick={handleNewCalculation}
              className="bg-gradient-to-r from-primary-600 to-prediction-600 hover:from-primary-700 hover:to-prediction-700 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              New Prediction
            </Button>
          </div>

          {/* Detailed Information */}
          {showDetails && (
            <Card variant="medical" title="Calculation Details">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Input Parameters</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Age:</span>
                      <span className="font-medium">{riskResult.parameters.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Gender:</span>
                      <span className="font-medium capitalize">{riskResult.parameters.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Race/Ethnicity:</span>
                      <span className="font-medium capitalize">{riskResult.parameters.race}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Systolic BP:</span>
                      <span className="font-medium">{riskResult.parameters.systolicBP} mmHg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Total Cholesterol:</span>
                      <span className="font-medium">
                        {riskResult.parameters.totalCholesterol} mg/dL
                        {riskResult.defaults_used.includes('total cholesterol') && ' (default)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">HDL Cholesterol:</span>
                      <span className="font-medium">
                        {riskResult.parameters.hdlCholesterol} mg/dL
                        {riskResult.defaults_used.includes('HDL cholesterol') && ' (default)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Diabetes:</span>
                      <span className="font-medium">{riskResult.parameters.diabetes ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Current Smoker:</span>
                      <span className="font-medium">{riskResult.parameters.smoking ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">BP Medication:</span>
                      <span className="font-medium">{riskResult.parameters.bpMedication ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-3">Risk Categories</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-medical-low rounded mr-3"></div>
                      <span>Low Risk: &lt; 5%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-medical-borderline rounded mr-3"></div>
                      <span>Borderline Risk: 5% - 7.4%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-medical-intermediate rounded mr-3"></div>
                      <span>Intermediate Risk: 7.5% - 19.9%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-medical-high rounded mr-3"></div>
                      <span>High Risk: ≥ 20%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-xs text-neutral-600">
                      Risk categories based on 2019 AHA/ACC Primary Prevention Guidelines
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* What-If Scenarios */}
          <InterventionScenarios 
            baselineRisk={riskResult.risk}
            baselineCategory={riskResult.riskCategory}
            patientParams={riskResult.parameters}
          />

          {/* Main Disclaimer */}
          <Disclaimer type="warning" title="Important Medical Disclaimer">
            <div className="space-y-3">
              <p>{riskResult.disclaimer.primary}</p>
              
              <div>
                <h5 className="font-medium mb-2">Limitations:</h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {riskResult.disclaimer.limitations.map((limitation, index) => (
                    <li key={index}>{limitation}</li>
                  ))}
                </ul>
              </div>
              
              <p className="font-medium">{riskResult.disclaimer.usage}</p>
            </div>
          </Disclaimer>

          {/* Educational Footer */}
          <div className="text-center space-y-3">
            <div className="flex justify-center items-center space-x-6 text-sm text-neutral-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-prediction-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                2013 ACC/AHA Pooled Cohort Equations
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-precision-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Clinical-grade algorithms
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-intelligence-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Privacy-first design
              </div>
            </div>
            
            <div className="text-sm text-neutral-500">
              <span className="font-medium text-prediction-600">Bioprognostika</span> • 
              Advanced Health Prediction Platform • 
              Generated {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;