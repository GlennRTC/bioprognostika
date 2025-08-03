import React from 'react';

interface AlgorithmToggleProps {
  selectedAlgorithm: 'PCE' | 'PREVENT';
  onAlgorithmChange: (algorithm: 'PCE' | 'PREVENT') => void;
  disabled?: boolean;
  className?: string;
}

const AlgorithmToggle: React.FC<AlgorithmToggleProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  disabled = false,
  className = ''
}) => {
  const handleToggle = (algorithm: 'PCE' | 'PREVENT') => {
    if (disabled || algorithm === selectedAlgorithm) return;
    
    const shouldSwitch = window.confirm(
      `Switch to ${algorithm} algorithm? This will reset your progress to Step 1 because ${algorithm} requires different parameters.`
    );
    
    if (shouldSwitch) {
      onAlgorithmChange(algorithm);
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <label className="text-sm font-medium text-neutral-700 mr-2">Algorithm:</label>
      <div className="flex bg-neutral-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => handleToggle('PCE')}
          disabled={disabled}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
            selectedAlgorithm === 'PCE'
              ? 'bg-white text-primary-700 shadow-sm ring-1 ring-primary-200'
              : 'text-neutral-600 hover:text-neutral-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          PCE (2013)
        </button>
        <button
          type="button"
          onClick={() => handleToggle('PREVENT')}
          disabled={disabled}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
            selectedAlgorithm === 'PREVENT'
              ? 'bg-white text-prediction-700 shadow-sm ring-1 ring-prediction-200'
              : 'text-neutral-600 hover:text-neutral-800'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          PREVENT (2024)
        </button>
      </div>
    </div>
  );
};

export default AlgorithmToggle;