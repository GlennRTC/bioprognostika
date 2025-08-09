import React, { memo } from 'react';
import { Card, Disclaimer } from '@/components/ui';
import { PatientParams } from '@/types';
import FormSection from './common/FormSection';
import FormField from './common/FormField';
import { getStepConfig } from '../config/stepConfig';

interface Step2HealthMeasurementsProps {
  formData: Partial<PatientParams> & { selectedAlgorithm?: 'PCE' | 'PREVENT' };
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
}

const Step2HealthMeasurements: React.FC<Step2HealthMeasurementsProps> = memo(({
  formData,
  errors,
  updateField,
}) => {
  const algorithm = formData.selectedAlgorithm || 'PREVENT';
  const stepConfig = getStepConfig(algorithm, 2);
  
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
        {/* Render sections from configuration */}
        {stepConfig.sections?.map((section, index) => (
          <FormSection
            key={index}
            title={section.title}
            description={section.description}
            fields={section.fields}
            formData={formData}
            errors={errors}
            updateField={updateField}
            className={section.className}
            icon={section.icon}
          />
        ))}

        {/* Blood Pressure Medication - Special case checkbox */}
        <div className="bg-primary-50 p-4 rounded-xl border border-primary-200">
          <FormField
            config={{
              key: 'bpMedication',
              label: 'I am currently taking blood pressure medication',
              type: 'checkbox',
              help: 'Check if you are currently on any blood pressure medications'
            }}
            value={formData.bpMedication}
            error={errors.bpMedication}
            onChange={updateField}
          />
        </div>

        {/* Medical History */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <h4 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Medical History
          </h4>
          
          <FormField
            config={{
              key: 'diabetes',
              label: 'I have diabetes (Type 1 or Type 2)',
              type: 'checkbox',
              help: 'Check if you have been diagnosed with diabetes'
            }}
            value={formData.diabetes}
            error={errors.diabetes}
            onChange={updateField}
          />
        </div>

        {/* Cholesterol Information */}
        <Disclaimer type="info">
          <p className="text-sm">
            <strong>Don't have recent cholesterol values?</strong> The calculator will use 
            population average values (Total: 200 mg/dL, HDL: 50 mg/dL) for estimation. 
            For more accurate results, consider getting a lipid panel from your healthcare provider.
          </p>
        </Disclaimer>

        {/* Measurement Tips */}
        <Disclaimer>
          <div className="text-sm space-y-2">
            <p><strong>Blood Pressure Tips:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Use values from a recent healthcare visit or home monitor</li>
              <li>Multiple readings are more accurate than single measurements</li>
              <li>Avoid caffeine 30 minutes before measuring</li>
            </ul>
          </div>
        </Disclaimer>
      </div>
    </Card>
  );
});

Step2HealthMeasurements.displayName = 'Step2HealthMeasurements';

export default Step2HealthMeasurements;