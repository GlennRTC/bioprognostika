/**
 * Risk Calculator Services Index
 * Centralized export and configuration for all risk calculation algorithms
 * 
 * Educational Research Tool - Not for Clinical Use
 * Provides unified access to PCE, PREVENT, and future algorithms
 */

// Algorithm implementations
export { PCERiskCalculator, pceCalculator } from './pceAlgorithm';
export { PREVENTRiskCalculator, preventCalculator } from './preventAlgorithm';

// Interface and factory
export { 
  AlgorithmRegistry, 
  RiskCalculatorFactory, 
  riskCalculatorFactory 
} from './algorithmInterface';

// Clinical utilities
export { 
  calculateEGFR, 
  calculateNonHDL, 
  calculateBMI,
  validateKidneyFunction,
  validateCholesterol,
  validateDiabetes,
  getCKDStage,
  CLINICAL_REFERENCES,
  getClinicalReference,
  formatCitation,
  getPubMedUrl,
  getDoiUrl
} from './clinicalUtils';

// Types (re-exported for convenience)
export type { 
  RiskCalculatorAlgorithm,
  ClinicalReference,
  ClinicalRecommendation,
  AlgorithmConfig
} from '@/types';

/**
 * Initialize the risk calculator factory with both algorithms
 */
import { pceCalculator } from './pceAlgorithm';
import { preventCalculator } from './preventAlgorithm';
import { riskCalculatorFactory } from './algorithmInterface';

// Register algorithms with the factory
riskCalculatorFactory.registerAlgorithm(pceCalculator);
riskCalculatorFactory.registerAlgorithm(preventCalculator);

// Set PREVENT as the default algorithm for new implementations
// (PCE remains available for comparison and backward compatibility)
riskCalculatorFactory.switchAlgorithm('PREVENT');

/**
 * Configured factory instance ready for use
 */
export const configuredRiskCalculator = riskCalculatorFactory;

/**
 * Helper function to switch between algorithms
 */
export function switchToAlgorithm(algorithmName: 'PCE' | 'PREVENT'): void {
  riskCalculatorFactory.switchAlgorithm(algorithmName);
}

/**
 * Helper function to enable/disable algorithm comparison
 */
export function enableAlgorithmComparison(enable: boolean = true): void {
  riskCalculatorFactory.updateConfig({ enableComparison: enable });
}

/**
 * Helper function to get current algorithm info
 */
export function getCurrentAlgorithmInfo() {
  return riskCalculatorFactory.getAlgorithmInfo();
}

/**
 * Helper function to get all available algorithms
 */
export function getAvailableAlgorithms(): string[] {
  return ['PCE', 'PREVENT']; // Could be made dynamic in the future
}

/**
 * Default configuration for production use
 */
export const DEFAULT_CONFIG = {
  algorithm: 'PREVENT' as const,
  enableComparison: true,  // Enable comparison by default for educational purposes
  showCitations: true,     // Show clinical references
  enableInterventions: true // Enable intervention modeling
};