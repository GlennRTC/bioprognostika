import React, { useState } from 'react';
import { RiskResult, RiskCategory, ClinicalReference } from '@/types';
import ReferenceBadge from './ReferenceBadge';
import MedicalTooltip, { MEDICAL_PARAMETERS } from './MedicalTooltip';

interface EnhancedRiskVisualizationProps {
  riskResult: RiskResult;
  className?: string;
  showComparison?: boolean;
  showInterventions?: boolean;
}

interface RiskLevelDescriptor {
  level: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  actionItems: string[];
  clinicalThresholds: {
    low: number;
    high: number;
  };
}

const RISK_DESCRIPTORS: Record<string, RiskLevelDescriptor> = {
  low: {
    level: 'Low Risk',
    color: 'text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    description: 'Excellent cardiovascular health with minimal risk of heart attack or stroke.',
    actionItems: [
      'Maintain current healthy lifestyle',
      'Continue regular preventive care',
      'Monitor risk factors annually'
    ],
    clinicalThresholds: { low: 0, high: 5 }
  },
  borderline: {
    level: 'Borderline Risk',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: (
      <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    description: 'Moderate cardiovascular risk. Lifestyle modifications can significantly reduce risk.',
    actionItems: [
      'Focus on heart-healthy lifestyle changes',
      'Consider discussing prevention strategies with your doctor',
      'Monitor blood pressure and cholesterol regularly'
    ],
    clinicalThresholds: { low: 5, high: 7.5 }
  },
  intermediate: {
    level: 'Intermediate Risk',
    color: 'text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: (
      <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    description: 'Elevated cardiovascular risk. Clinical intervention may be recommended.',
    actionItems: [
      'Discuss prevention medications with your healthcare provider',
      'Implement comprehensive lifestyle changes',
      'Consider more frequent monitoring and follow-up'
    ],
    clinicalThresholds: { low: 7.5, high: 20 }
  },
  high: {
    level: 'High Risk',
    color: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: (
      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    description: 'Significantly elevated cardiovascular risk. Clinical intervention strongly recommended.',
    actionItems: [
      'Urgent discussion with healthcare provider recommended',
      'Consider preventive medications (statins, blood pressure management)',
      'Implement aggressive lifestyle modifications',
      'Regular clinical monitoring and follow-up'
    ],
    clinicalThresholds: { low: 20, high: 100 }
  }
};

const EnhancedRiskVisualization: React.FC<EnhancedRiskVisualizationProps> = ({
  riskResult,
  className = '',
  showComparison = true,
  showInterventions = true
}) => {
  const [activeTimeline, setActiveTimeline] = useState<'10year' | '30year'>('10year');
  const [showDetails, setShowDetails] = useState(false);

  // Get current risk and category based on selected timeline
  const getCurrentRisk = () => {
    if (activeTimeline === '30year' && riskResult.risk30Year !== undefined) {
      return {
        risk: riskResult.risk30Year,
        category: riskResult.riskCategory30Year || riskResult.riskCategory
      };
    }
    return {
      risk: riskResult.risk,
      category: riskResult.riskCategory
    };
  };

  const { risk, category } = getCurrentRisk();
  const riskDescriptor = RISK_DESCRIPTORS[category.level] || RISK_DESCRIPTORS.low;
  
  // Calculate risk visualization metrics
  const getRiskVisualization = (riskPercent: number) => {
    const outOf100 = Math.round(riskPercent);
    const peopleAffected = Math.max(1, outOf100);
    const peopleUnaffected = 100 - peopleAffected;
    
    return {
      affected: peopleAffected,
      unaffected: peopleUnaffected,
      percentage: riskPercent
    };
  };

  const currentVisualization = getRiskVisualization(risk);

  // Generate people icons for visualization
  const generatePeopleIcons = (total: number, affected: number) => {
    const icons = [];
    for (let i = 0; i < total; i++) {
      icons.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < affected ? 'text-red-500' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      );
    }
    return icons;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Risk Display */}
      <div className={`p-6 rounded-xl border-2 ${riskDescriptor.bgColor} ${riskDescriptor.borderColor}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {riskDescriptor.icon}
            <div>
              <h3 className={`text-2xl font-bold ${riskDescriptor.color}`}>
                {risk.toFixed(1)}%
              </h3>
              <p className={`text-sm font-medium ${riskDescriptor.color}`}>
                {activeTimeline === '10year' ? '10-Year' : '30-Year'} Cardiovascular Risk
              </p>
            </div>
          </div>
          
          {/* Algorithm Badge */}
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskDescriptor.bgColor} ${riskDescriptor.color} border ${riskDescriptor.borderColor}`}>
              {riskResult.algorithm}
            </span>
          </div>
        </div>

        {/* Risk Level Description */}
        <div className="mb-4">
          <h4 className={`text-lg font-semibold ${riskDescriptor.color} mb-2`}>
            {riskDescriptor.level}
          </h4>
          <p className={`text-sm ${riskDescriptor.color} leading-relaxed`}>
            {riskDescriptor.description}
          </p>
        </div>

        {/* Timeline Selector (PREVENT only) */}
        {riskResult.algorithm === 'PREVENT' && riskResult.risk30Year !== undefined && (
          <div className="mb-4">
            <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-gray-200 inline-flex">
              <button
                onClick={() => setActiveTimeline('10year')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTimeline === '10year'
                    ? 'bg-prediction-500 text-white'
                    : 'text-gray-600 hover:text-prediction-600'
                }`}
              >
                10-Year Risk
              </button>
              <button
                onClick={() => setActiveTimeline('30year')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activeTimeline === '30year'
                    ? 'bg-prediction-500 text-white'
                    : 'text-gray-600 hover:text-prediction-600'
                }`}
              >
                30-Year Risk
              </button>
            </div>
          </div>
        )}

        {/* Visual Risk Representation */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="text-sm font-semibold text-gray-900 mb-3">
            Risk Visualization: Out of 100 people like you
          </h5>
          
          {/* People Grid - show subset for large numbers */}
          <div className="mb-3">
            {currentVisualization.affected <= 25 ? (
              <div className="grid grid-cols-10 gap-1 max-w-md">
                {generatePeopleIcons(100, currentVisualization.affected)}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-10 gap-1 max-w-md">
                  {generatePeopleIcons(20, Math.min(20, Math.round(currentVisualization.affected / 5)))}
                </div>
                <p className="text-xs text-gray-600">
                  Showing 1 in 5 people for clarity. Red figures represent those who may experience a cardiovascular event.
                </p>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                May experience cardiovascular event
              </span>
              <span className="font-medium">{currentVisualization.affected} people</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                Likely to remain healthy
              </span>
              <span className="font-medium">{currentVisualization.unaffected} people</span>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Action Items */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-prediction-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Recommended Actions
        </h4>
        
        <ul className="space-y-3">
          {riskDescriptor.actionItems.map((action, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${riskDescriptor.bgColor} ${riskDescriptor.borderColor} border`}>
                <span className={`text-xs font-bold ${riskDescriptor.color}`}>{index + 1}</span>
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">{action}</span>
            </li>
          ))}
        </ul>

        {category.level === 'high' && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">High Risk Alert</p>
                <p>Your risk level indicates strong benefit from clinical intervention. Consider scheduling an appointment with your healthcare provider to discuss prevention strategies.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Algorithm Comparison (if available) */}
      {showComparison && riskResult.comparisonResults && (
        <div className="bg-gradient-to-r from-prediction-50 to-intelligence-50 p-6 rounded-lg border border-prediction-200">
          <h4 className="text-lg font-semibold text-prediction-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Algorithm Comparison
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded border">
              <h5 className="text-sm font-medium text-gray-600 mb-1">PCE (2013)</h5>
              <p className="text-2xl font-bold text-gray-900">{riskResult.comparisonResults.pceRisk?.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">10-year risk</p>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <h5 className="text-sm font-medium text-gray-600 mb-1">PREVENT (2024)</h5>
              <p className="text-2xl font-bold text-gray-900">{riskResult.comparisonResults.preventRisk?.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">10-year risk</p>
            </div>
          </div>

          {riskResult.comparisonResults.clinicalSignificance && (
            <div className="bg-white p-3 rounded border-l-4 border-l-prediction-500">
              <p className="text-sm text-gray-700">
                <strong>Clinical Significance:</strong> {riskResult.comparisonResults.clinicalSignificance}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Technical Details Toggle */}
      <div className="bg-gray-50 rounded-lg border border-gray-200">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors rounded-lg"
        >
          <span className="text-sm font-medium text-gray-900">Technical Details & Limitations</span>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {showDetails && (
          <div className="px-4 pb-4 space-y-4">
            {/* Confidence Level */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Prediction Confidence</h5>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  riskResult.confidence === 'standard' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {riskResult.confidence === 'standard' ? 'Standard Confidence' : 'Lower Confidence'}
                </span>
                {riskResult.confidence === 'lower' && (
                  <span className="text-xs text-gray-600">
                    Some parameters outside validated ranges
                  </span>
                )}
              </div>
            </div>

            {/* Warnings */}
            {riskResult.warnings.length > 0 && (
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Important Notes</h5>
                <ul className="space-y-1">
                  {riskResult.warnings.map((warning, index) => (
                    <li key={index} className="text-xs text-amber-700 flex items-start">
                      <svg className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Algorithm Limitations */}
            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Algorithm Limitations</h5>
              <div className="text-xs text-gray-600 space-y-1">
                {riskResult.disclaimer.limitations.map((limitation, index) => (
                  <p key={index}>• {limitation}</p>
                ))}
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <h5 className="text-sm font-semibold text-blue-900 mb-1">Usage Guidelines</h5>
              <p className="text-xs text-blue-800">{riskResult.disclaimer.usage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedRiskVisualization;