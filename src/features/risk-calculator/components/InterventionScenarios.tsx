import React from 'react';
import { Card, RiskIndicator, Button } from '@/components/ui';
import { InterventionScenario, PatientParams, InterventionRequest } from '@/types';
import { pceCalculator } from '../services/pceAlgorithm';

interface InterventionScenariosProps {
  baselineRisk: number;
  baselineCategory: any;
  patientParams: PatientParams;
}

const InterventionScenarios: React.FC<InterventionScenariosProps> = ({
  baselineRisk,
  baselineCategory,
  patientParams,
}) => {
  const [scenarios, setScenarios] = React.useState<InterventionScenario[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    generateScenarios();
  }, [patientParams]);

  const generateScenarios = async () => {
    setIsLoading(true);
    
    const interventions: InterventionRequest[] = [];
    
    // Add relevant interventions based on patient profile
    if (patientParams.smoking) {
      interventions.push({ type: 'smoking_cessation' });
    }
    
    if (patientParams.systolicBP > 130) {
      const reduction = Math.min(20, patientParams.systolicBP - 120);
      interventions.push({ type: 'blood_pressure_reduction', reduction });
    }
    
    // Always show statin therapy scenario
    interventions.push({ type: 'statin_therapy' });
    
    // Always show physical activity scenario
    interventions.push({ type: 'physical_activity' });

    try {
      const calculatedScenarios = pceCalculator.modelInterventions(patientParams, interventions);
      setScenarios(calculatedScenarios);
    } catch (error) {
      console.error('Error generating intervention scenarios:', error);
    }
    
    setIsLoading(false);
  };

  const calculateRiskReduction = (newRisk: number) => {
    const absoluteReduction = baselineRisk - newRisk;
    const relativeReduction = (absoluteReduction / baselineRisk) * 100;
    return { absolute: absoluteReduction, relative: relativeReduction };
  };

  const getImpactColor = (reduction: number) => {
    if (reduction >= 5) return 'text-green-600';
    if (reduction >= 2) return 'text-yellow-600';
    return 'text-neutral-600';
  };

  if (isLoading) {
    return (
      <Card variant="medical" title="Generating What-If Scenarios...">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-neutral-600">Calculating interventions...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="medical" title="What-If Scenarios" subtitle="See how lifestyle changes could impact your risk">
      <div className="space-y-6">
        {/* Baseline Risk Display */}
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-neutral-900">Your Current Risk</h4>
              <p className="text-sm text-neutral-600">Based on your current health profile</p>
            </div>
            <RiskIndicator 
              risk={baselineRisk} 
              category={baselineCategory} 
              size="sm" 
              showLabel={false} 
            />
          </div>
        </div>

        {/* Intervention Scenarios */}
        <div className="grid gap-4">
          {scenarios.map((scenario, index) => {
            if (!scenario.newRisk.success) return null;
            
            const reduction = calculateRiskReduction(scenario.newRisk.risk);
            
            return (
              <div 
                key={index} 
                className="bg-white border border-primary-100 rounded-xl p-4 hover:shadow-medical transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-neutral-900 mb-1">
                      {scenario.intervention}
                    </h5>
                    <p className="text-sm text-neutral-600 mb-2">
                      Time to benefit: {scenario.effect.timeFrame} • Source: {scenario.effect.source}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-neutral-600">New risk: </span>
                        <span className="font-medium text-neutral-900">
                          {scenario.newRisk.risk.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-neutral-600">Reduction: </span>
                        <span className={`font-medium ${getImpactColor(reduction.absolute)}`}>
                          -{reduction.absolute.toFixed(1)}% 
                          ({reduction.relative.toFixed(0)}% relative)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <RiskIndicator 
                      risk={scenario.newRisk.risk} 
                      category={scenario.newRisk.riskCategory} 
                      size="sm" 
                      showLabel={false} 
                    />
                  </div>
                </div>

                {/* Impact Visualization */}
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-primary-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, (reduction.relative / 100) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500 mt-1">
                    <span>Current Risk</span>
                    <span>Potential Risk</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Combined Impact */}
        {scenarios.length > 1 && (
          <div className="bg-primary-50 p-4 rounded-xl border border-primary-200">
            <h4 className="text-lg font-semibold text-primary-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Combined Impact Potential
            </h4>
            <p className="text-sm text-primary-800 mb-3">
              Making multiple lifestyle changes together often provides greater benefits than 
              individual interventions alone.
            </p>
            <div className="text-sm text-primary-700">
              <strong>Note:</strong> Combined effects are not simply additive and depend on 
              individual health factors. Consult your healthcare provider for personalized 
              intervention planning.
            </div>
          </div>
        )}

        {/* Action Items */}
        <div className="bg-healing-sage/10 p-4 rounded-xl border border-healing-sage/30">
          <h4 className="text-lg font-semibold text-healing-earth mb-3">
            Next Steps
          </h4>
          <ul className="space-y-2 text-sm text-healing-earth">
            <li className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-healing-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Share these results with your healthcare provider
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-healing-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Discuss realistic intervention goals and timelines
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-healing-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Consider getting updated lab values for more accurate calculations
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 text-healing-sage" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Start with small, achievable changes to build sustainable habits
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default InterventionScenarios;