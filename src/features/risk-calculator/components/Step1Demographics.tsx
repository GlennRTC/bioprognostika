import React, { memo } from 'react';
import { Card, Disclaimer } from '@/components/ui';
import { PatientParams } from '@/types';
import FormField from './common/FormField';
import { getStepConfig } from '../config/stepConfig';

interface Step1DemographicsProps {
  formData: Partial<PatientParams> & { selectedAlgorithm?: 'PCE' | 'PREVENT' };
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
}

const Step1Demographics: React.FC<Step1DemographicsProps> = memo(({
  formData,
  errors,
  updateField,
}) => {
  const algorithm = formData.selectedAlgorithm || 'PREVENT';
  const stepConfig = getStepConfig(algorithm, 1);
  
  if (!stepConfig) {
    return (
      <Card variant="medical" title="Error" subtitle="Configuration not found">
        <p>Unable to load step configuration.</p>
      </Card>
    );
  }

  return (
    <Card variant="medical" title={stepConfig.title} subtitle={stepConfig.subtitle}>
      <div className="space-y-6">
        {/* Render form fields from configuration */}
        {stepConfig.fields.map((field) => (
          <FormField
            key={field.key}
            config={field}
            value={formData[field.key]}
            error={errors[field.key]}
            onChange={updateField}
          />
        ))}

        
        {/* Conditional disclaimers based on user selections */}
        {formData.gender === 'non-binary' && (
          <Disclaimer type="info">
            <p className="text-sm">
              <strong>Non-binary gender calculation:</strong> Risk will be estimated using averaged 
              male and female calculations due to limited research data for non-binary populations. 
              Results may have lower confidence intervals.
            </p>
          </Disclaimer>
        )}

        {formData.race === 'other' && (
          <Disclaimer type="info">
            <p className="text-sm">
              <strong>Other race/ethnicity:</strong> Calculations will use Non-Hispanic White 
              coefficients as the closest available match. Individual risk may vary for specific 
              ethnic populations not represented in the original study data.
            </p>
          </Disclaimer>
        )}

        {/* General disclaimer for this step */}
        <Disclaimer>
          <p className="text-sm">
            <strong>Privacy Notice:</strong> All information is processed locally in your browser. 
            No personal data is transmitted or stored on external servers.
          </p>
        </Disclaimer>
      </div>
    </Card>
  );
});

Step1Demographics.displayName = 'Step1Demographics';

export default Step1Demographics;