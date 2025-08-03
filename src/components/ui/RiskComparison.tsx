import React from 'react';
import { RiskComparisonResult, RiskCategory } from '@/types';

interface RiskComparisonProps {
  comparison: RiskComparisonResult;
  className?: string;
}

const RiskComparison: React.FC<RiskComparisonProps> = ({
  comparison,
  className = ''
}) => {
  if (!comparison.pceRisk || !comparison.preventRisk) {
    return null;
  }

  const getRiskChangeIcon = () => {
    if (comparison.reclassificationFlag === 'up') {
      return (
        <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
        </svg>
      );
    } else if (comparison.reclassificationFlag === 'down') {
      return (
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const getComparisonColor = () => {
    if (comparison.reclassificationFlag === 'up') return 'border-orange-200 bg-orange-50';
    if (comparison.reclassificationFlag === 'down') return 'border-green-200 bg-green-50';
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <div className={`p-4 rounded-lg border ${getComparisonColor()} ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        {getRiskChangeIcon()}
        <span className="ml-2">Algorithm Comparison</span>
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded border">
          <div className="text-sm font-medium text-gray-600">PCE (2013)</div>
          <div className="text-xl font-bold text-gray-900">{comparison.pceRisk}%</div>
          <div className="text-xs text-gray-500">10-year risk</div>
        </div>
        
        <div className="bg-white p-3 rounded border">
          <div className="text-sm font-medium text-gray-600">PREVENT (2024)</div>
          <div className="text-xl font-bold text-gray-900">{comparison.preventRisk}%</div>
          <div className="text-xs text-gray-500">10-year risk</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Risk Difference:</span>
          <span className="font-medium">
            {comparison.riskDifference ? `${comparison.riskDifference.toFixed(1)}%` : 'N/A'}
          </span>
        </div>
        
        {comparison.reclassificationFlag !== 'none' && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Reclassification:</span>
            <span className={`font-medium ${
              comparison.reclassificationFlag === 'up' ? 'text-orange-600' : 'text-green-600'
            }`}>
              Risk category changed ({comparison.reclassificationFlag}ward)
            </span>
          </div>
        )}
      </div>
      
      {comparison.clinicalSignificance && (
        <div className="mt-3 p-3 bg-white rounded border-l-4 border-l-blue-500">
          <div className="text-sm text-gray-700">
            <strong>Clinical Significance:</strong> {comparison.clinicalSignificance}
          </div>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-600">
        <strong>Note:</strong> Algorithm comparison is provided for educational purposes. 
        Both algorithms are validated clinical tools with different strengths and applications.
      </div>
    </div>
  );
};

export default RiskComparison;