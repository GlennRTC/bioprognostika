import React from 'react';
import { Input, Card, Disclaimer, MedicalInput, SDILookupGuide } from '@/components/ui';
import { PatientParams } from '@/types';
import { calculateBMI } from '../services/clinicalUtils';

interface Step4LifestyleSocialProps {
  formData: Partial<PatientParams> & { selectedAlgorithm?: 'PCE' | 'PREVENT' };
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
}

const Step4LifestyleSocial: React.FC<Step4LifestyleSocialProps> = ({
  formData,
  errors,
  updateField,
}) => {
  const stepTitle = formData.selectedAlgorithm === 'PREVENT' 
    ? 'Step 4 of 4: Lifestyle & Social Factors'
    : 'Step 3 of 3: Lifestyle Factors';

  return (
    <Card variant="medical" title="Lifestyle & Social Factors" subtitle={stepTitle}>
      <div className="space-y-6">
        {/* Smoking Section */}
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
            Smoking Status
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.smoking || false}
                onChange={(e) => updateField('smoking', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-neutral-700">
                I currently smoke cigarettes or have quit within the past year
              </span>
            </label>

            {formData.smoking && (
              <Disclaimer type="warning" className="mt-3">
                <p className="text-sm">
                  <strong>Important:</strong> Smoking significantly increases cardiovascular risk. 
                  Consider speaking with your healthcare provider about smoking cessation programs.
                </p>
              </Disclaimer>
            )}
          </div>
        </div>

        {/* Physical Measurements */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Physical Measurements (Optional)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Weight"
              name="weight"
              type="number"
              value={formData.weight || ''}
              onChange={(value) => updateField('weight', Number(value) || undefined)}
              placeholder="150"
              min={50}
              max={500}
              error={errors.weight}
              help="pounds (lbs)"
            />
            
            <Input
              label="Height"
              name="height"
              type="number"
              value={formData.height || ''}
              onChange={(value) => updateField('height', Number(value) || undefined)}
              placeholder="68"
              min={36}
              max={96}
              error={errors.height}
              help="inches (e.g., 5'8&quot; = 68 inches)"
            />
          </div>

          {formData.weight && formData.height && (
            <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
              <strong>Calculated BMI:</strong> {calculateBMI(formData.weight, formData.height)} kg/m²
              {(() => {
                const bmi = calculateBMI(formData.weight, formData.height);
                if (bmi < 18.5) return ' (Underweight)';
                if (bmi < 25) return ' (Normal weight)';
                if (bmi < 30) return ' (Overweight)';
                return ' (Obese)';
              })()}
            </div>
          )}
        </div>

        {/* Social Determinants (PREVENT enhancement) */}
        {formData.selectedAlgorithm === 'PREVENT' && (
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
            <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Social Determinants of Health (Optional)
            </h4>
            
            <div className="space-y-4">
              <MedicalInput
                label="Social Deprivation Index"
                name="socialDeprivationIndex"
                type="number"
                value={formData.socialDeprivationIndex || ''}
                onChange={(value) => updateField('socialDeprivationIndex', typeof value === 'number' ? value : undefined)}
                placeholder="Enter percentile (0-100)"
                min={0}
                max={100}
                error={errors.socialDeprivationIndex}
                help="Enter your neighborhood's social deprivation percentile (0 = least deprived, 100 = most deprived)"
                medicalParameter="socialDeprivationIndex"
                showMedicalTooltip={true}
                clinicalContext="SDI helps personalize cardiovascular risk by accounting for social and environmental factors that affect health outcomes"
                warningThresholds={{
                  high: 75,
                  message: "High social deprivation may indicate need for enhanced support services and community-based interventions"
                }}
                normalRange="Varies by location (0-100 percentile)"
              />

              <SDILookupGuide
                currentScore={formData.socialDeprivationIndex}
                onScoreEntered={(score) => updateField('socialDeprivationIndex', score)}
                className="mt-4"
              />

              <Disclaimer type="info">
                <div className="text-sm space-y-2">
                  <p>
                    <strong>About Social Determinants:</strong> The PREVENT algorithm incorporates social 
                    factors to provide more comprehensive risk assessment. Social disadvantage is associated 
                    with higher rates of cardiovascular disease through multiple pathways including:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Limited access to healthy foods and safe exercise opportunities</li>
                    <li>Higher stress levels and reduced social support</li>
                    <li>Environmental exposures and housing quality issues</li>
                    <li>Reduced access to preventive healthcare services</li>
                    <li>Economic barriers to medication adherence</li>
                  </ul>
                  <p>
                    <strong>Privacy Note:</strong> This information is processed locally and helps provide 
                    more personalized risk assessment. You may leave this field blank if preferred.
                  </p>
                </div>
              </Disclaimer>
            </div>
          </div>
        )}

        {/* Lifestyle Recommendations */}
        <div className="bg-healing-sage/10 p-4 rounded-xl border border-healing-sage/30">
          <h4 className="text-lg font-semibold text-healing-earth mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z" clipRule="evenodd" />
            </svg>
            Heart-Healthy Lifestyle
          </h4>
          
          <div className="text-sm text-healing-earth space-y-2">
            <p><strong>Regardless of your risk level, these lifestyle factors can improve cardiovascular health:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Regular physical activity (150+ minutes moderate exercise per week)</li>
              <li>Heart-healthy diet rich in fruits, vegetables, and whole grains</li>
              <li>Maintain healthy weight (BMI 18.5-24.9)</li>
              <li>Limit alcohol consumption</li>
              <li>Manage stress through healthy coping strategies</li>
              <li>Get adequate sleep (7-9 hours per night)</li>
              <li>Stay up to date with preventive healthcare</li>
            </ul>
          </div>
        </div>

        {/* Data Privacy Note */}
        <Disclaimer>
          <div className="text-sm space-y-2">
            <p><strong>Privacy Note:</strong></p>
            <p>
              All information entered is processed locally and stored only in your browser. 
              No personal health information is transmitted to external servers. You can 
              clear this data at any time by resetting the form.
            </p>
          </div>
        </Disclaimer>
      </div>
    </Card>
  );
};

export default Step4LifestyleSocial;