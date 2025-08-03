import React from 'react';
import { RiskCategory } from '@/types';

interface RiskIndicatorProps {
  risk: number;
  category: RiskCategory;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  risk,
  category,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl',
  };
  
  const labelSizeClasses = {
    sm: 'text-sm mt-2',
    md: 'text-base mt-3',
    lg: 'text-lg mt-4',
  };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-medical-low text-white';
      case 'borderline':
        return 'bg-medical-borderline text-neutral-900';
      case 'intermediate':
        return 'bg-medical-intermediate text-white';
      case 'high':
        return 'bg-medical-high text-white';
      default:
        return 'bg-neutral-500 text-white';
    }
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        ${getRiskColor(category.level)}
        rounded-full flex items-center justify-center font-bold shadow-lg
      `}>
        {risk.toFixed(1)}%
      </div>
      
      {showLabel && (
        <div className={`text-center ${labelSizeClasses[size]}`}>
          <p className="font-medium text-neutral-900">{category.message}</p>
          <p className="text-neutral-600 text-sm">10-year cardiovascular risk</p>
        </div>
      )}
    </div>
  );
};

export default RiskIndicator;