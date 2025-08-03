/**
 * Risk Calculator Algorithm Interface
 * Provides abstraction layer for different cardiovascular risk calculation algorithms
 * 
 * Educational Research Tool - Not for Clinical Use
 * Enables seamless switching between PCE and PREVENT algorithms
 */

import { 
  PatientParams, 
  RiskResult, 
  InterventionRequest, 
  InterventionScenario, 
  RiskCalculatorAlgorithm,
  ClinicalRecommendation,
  ClinicalReference,
  AlgorithmConfig
} from '@/types';

/**
 * Algorithm Registry for managing multiple risk calculation algorithms
 */
export class AlgorithmRegistry {
  private algorithms = new Map<string, RiskCalculatorAlgorithm>();
  private activeAlgorithm: string = 'PCE'; // Default to PCE for backward compatibility

  /**
   * Register a new algorithm
   */
  register(algorithm: RiskCalculatorAlgorithm): void {
    this.algorithms.set(algorithm.name, algorithm);
  }

  /**
   * Get algorithm by name
   */
  getAlgorithm(name: string): RiskCalculatorAlgorithm | undefined {
    return this.algorithms.get(name);
  }

  /**
   * Get active algorithm
   */
  getActiveAlgorithm(): RiskCalculatorAlgorithm {
    const algorithm = this.algorithms.get(this.activeAlgorithm);
    if (!algorithm) {
      throw new Error(`Active algorithm '${this.activeAlgorithm}' not found`);
    }
    return algorithm;
  }

  /**
   * Set active algorithm
   */
  setActiveAlgorithm(name: string): void {
    if (!this.algorithms.has(name)) {
      throw new Error(`Algorithm '${name}' not registered`);
    }
    this.activeAlgorithm = name;
  }

  /**
   * List available algorithms
   */
  getAvailableAlgorithms(): string[] {
    return Array.from(this.algorithms.keys());
  }

  /**
   * Compare results between algorithms
   */
  async compareAlgorithms(params: PatientParams, algorithmNames: string[]): Promise<Map<string, RiskResult>> {
    const results = new Map<string, RiskResult>();
    
    for (const name of algorithmNames) {
      const algorithm = this.algorithms.get(name);
      if (algorithm) {
        try {
          const result = algorithm.calculateRisk(params);
          results.set(name, result);
        } catch (error) {
          // Create error result for failed calculations
          const errorResult: RiskResult = {
            success: false,
            error: `${name} calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            risk: 0,
            riskCategory: { level: 'low', color: '#22C55E', message: 'Error' },
            confidence: 'standard',
            algorithm: name as any,
            parameters: params,
            defaults_used: [],
            warnings: [],
            interpretation: '',
            disclaimer: {
              primary: 'Calculation failed',
              limitations: [],
              usage: 'Error occurred during calculation'
            }
          };
          results.set(name, errorResult);
        }
      }
    }
    
    return results;
  }
}

/**
 * Risk Calculator Factory
 * Provides unified interface for risk calculations with algorithm switching
 */
export class RiskCalculatorFactory {
  private registry: AlgorithmRegistry;
  private config: AlgorithmConfig;

  constructor(config: AlgorithmConfig = {
    algorithm: 'PCE',
    enableComparison: false,
    showCitations: false,
    enableInterventions: true
  }) {
    this.registry = new AlgorithmRegistry();
    this.config = config;
  }

  /**
   * Register algorithm with factory
   */
  registerAlgorithm(algorithm: RiskCalculatorAlgorithm): void {
    this.registry.register(algorithm);
  }

  /**
   * Calculate risk using active algorithm
   */
  async calculateRisk(params: PatientParams): Promise<RiskResult> {
    const algorithm = this.registry.getActiveAlgorithm();
    let primaryResult = algorithm.calculateRisk(params);

    // Add comparison results if enabled
    if (this.config.enableComparison && this.registry.getAvailableAlgorithms().length > 1) {
      const comparisonResults = await this.registry.compareAlgorithms(
        params, 
        this.registry.getAvailableAlgorithms()
      );
      
      primaryResult = this.enhanceWithComparison(primaryResult, comparisonResults);
    }

    return primaryResult;
  }

  /**
   * Model interventions using active algorithm
   */
  modelInterventions(
    baselineParams: PatientParams, 
    interventions: InterventionRequest[]
  ): InterventionScenario[] {
    const algorithm = this.registry.getActiveAlgorithm();
    return algorithm.modelInterventions(baselineParams, interventions);
  }

  /**
   * Validate inputs using active algorithm
   */
  validateInputs(params: PatientParams): { isValid: boolean; errors: string[]; warnings: string[] } {
    const algorithm = this.registry.getActiveAlgorithm();
    return algorithm.validateInputs(params);
  }

  /**
   * Get clinical recommendations
   */
  getRecommendations(riskResult: RiskResult): ClinicalRecommendation[] {
    const algorithm = this.registry.getActiveAlgorithm();
    return algorithm.getRecommendations(riskResult);
  }

  /**
   * Get clinical citations
   */
  getCitations(): ClinicalReference[] {
    const algorithm = this.registry.getActiveAlgorithm();
    return algorithm.getCitations();
  }

  /**
   * Switch algorithm
   */
  switchAlgorithm(algorithmName: string): void {
    this.registry.setActiveAlgorithm(algorithmName);
    this.config.algorithm = algorithmName as any;
  }

  /**
   * Get current configuration
   */
  getConfig(): AlgorithmConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<AlgorithmConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (updates.algorithm) {
      this.registry.setActiveAlgorithm(updates.algorithm);
    }
  }

  /**
   * Get algorithm metadata
   */
  getAlgorithmInfo(): {
    name: string;
    version: string;
    ageRange: { min: number; max: number };
    requiredParameters: string[];
    optionalParameters: string[];
  } {
    const algorithm = this.registry.getActiveAlgorithm();
    return {
      name: algorithm.name,
      version: algorithm.version,
      ageRange: algorithm.ageRange,
      requiredParameters: algorithm.requiredParameters as string[],
      optionalParameters: algorithm.optionalParameters as string[]
    };
  }

  /**
   * Enhanced result with comparison data
   */
  private enhanceWithComparison(
    primaryResult: RiskResult, 
    comparisonResults: Map<string, RiskResult>
  ): RiskResult {
    const algorithms = Array.from(comparisonResults.keys());
    
    if (algorithms.length < 2) {
      return primaryResult;
    }

    // Find PCE and PREVENT results for comparison
    const pceResult = comparisonResults.get('PCE');
    const preventResult = comparisonResults.get('PREVENT');

    if (pceResult && preventResult && pceResult.success && preventResult.success) {
      const riskDifference = Math.abs(preventResult.risk - pceResult.risk);
      let reclassificationFlag: 'up' | 'down' | 'none' = 'none';
      
      // Determine reclassification
      if (preventResult.riskCategory.level !== pceResult.riskCategory.level) {
        const riskLevels = ['low', 'borderline', 'intermediate', 'high'];
        const pceIndex = riskLevels.indexOf(pceResult.riskCategory.level);
        const preventIndex = riskLevels.indexOf(preventResult.riskCategory.level);
        reclassificationFlag = preventIndex > pceIndex ? 'up' : 'down';
      }

      primaryResult.comparisonResults = {
        pceRisk: pceResult.risk,
        preventRisk: preventResult.risk,
        riskDifference,
        reclassificationFlag,
        clinicalSignificance: this.assessClinicalSignificance(riskDifference, reclassificationFlag)
      };
    }

    return primaryResult;
  }

  /**
   * Assess clinical significance of risk difference
   */
  private assessClinicalSignificance(riskDifference: number, reclassification: 'up' | 'down' | 'none'): string {
    if (reclassification !== 'none') {
      return `Risk category changed (${reclassification}ward). Consider clinical review.`;
    }
    
    if (riskDifference > 5) {
      return 'Significant risk difference detected. Review parameters and consider clinical correlation.';
    }
    
    if (riskDifference > 2) {
      return 'Moderate risk difference. Results are generally consistent.';
    }
    
    return 'Minimal risk difference. Results are highly consistent.';
  }
}

// Singleton factory instance
export const riskCalculatorFactory = new RiskCalculatorFactory();