import React from 'react';
import { Input, Card, Disclaimer } from '@/components/ui';
import { PatientParams } from '@/types';

interface Step3LifestyleFactorsProps {
  formData: Partial<PatientParams>;
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
}

const Step3LifestyleFactors: React.FC<Step3LifestyleFactorsProps> = ({
  formData,
  errors,
  updateField,
}) => {
  return (
    <Card variant="medical" title="Lifestyle Factors" subtitle="Step 3 of 3: Your current lifestyle">
      <div className="space-y-6">
        {/* Smoking Status */}
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
                I currently smoke cigarettes (any amount)
              </span>
            </label>
          </div>

          {formData.smoking && (
            <Disclaimer type="warning" className="mt-4">
              <p className="text-sm">
                <strong>Smoking significantly increases cardiovascular risk.</strong> 
                The "What-If" scenarios will show how quitting smoking could dramatically 
                reduce your 10-year risk of heart disease and stroke.
              </p>
            </Disclaimer>
          )}
        </div>

        {/* Physical Activity & Weight (Optional) */}
        <div className="bg-healing-mint/20 p-4 rounded-xl border border-healing-mint/50">
          <h4 className="text-lg font-semibold text-healing-ocean mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Physical Activity & Weight (Optional)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Weight"
              name="weight"
              type="number"
              value={formData.weight || ''}
              onChange={(value) => updateField('weight', Number(value) || undefined)}
              placeholder="150"
              min={80}
              max={400}
              error={errors.weight}
              help="Pounds (lbs) - Optional for BMI calculation"
            />
            
            <Input
              label="Height"
              name="height"
              type="number"
              value={formData.height || ''}
              onChange={(value) => updateField('height', Number(value) || undefined)}
              placeholder="68"
              min={48}
              max={84}
              error={errors.height}
              help="Inches - Optional for BMI calculation"
            />
          </div>

          {/* BMI Display */}
          {formData.weight && formData.height && (
            <div className="mt-4 p-3 bg-white rounded-lg border">
              {(() => {
                const bmi = (formData.weight / (formData.height * formData.height)) * 703;
                let category = '';
                let color = '';
                
                if (bmi < 18.5) {
                  category = 'Underweight';
                  color = 'text-blue-600';
                } else if (bmi < 25) {
                  category = 'Normal weight';
                  color = 'text-green-600';
                } else if (bmi < 30) {
                  category = 'Overweight';
                  color = 'text-yellow-600';
                } else {
                  category = 'Obese';
                  color = 'text-red-600';
                }
                
                return (
                  <div className="text-sm">
                    <span className="text-neutral-600">BMI: </span>
                    <span className="font-medium">{bmi.toFixed(1)}</span>
                    <span className={`ml-2 font-medium ${color}`}>({category})</span>
                  </div>
                );
              })()}
            </div>
          )}

          <Disclaimer type="info" className="mt-4">
            <p className="text-sm">
              <strong>Weight and BMI:</strong> While not directly used in the PCE calculation, 
              weight information helps us provide more relevant lifestyle intervention scenarios 
              for your "What-If" analysis.
            </p>
          </Disclaimer>
        </div>

        {/* Final Step Information */}
        <div className="bg-primary-50 p-4 rounded-xl border border-primary-200">
          <h4 className="text-lg font-semibold text-primary-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Ready for Your Risk Assessment
          </h4>
          
          <p className="text-sm text-primary-800 mb-4">
            You're almost done! Once you click "Calculate Risk," we'll:
          </p>
          
          <ul className="text-sm text-primary-700 space-y-1 list-disc list-inside ml-4">
            <li>Calculate your 10-year cardiovascular disease risk</li>
            <li>Show you personalized "What-If" scenarios</li>
            <li>Provide evidence-based lifestyle recommendations</li>
            <li>Generate a summary you can discuss with your healthcare provider</li>
          </ul>
        </div>

        {/* Privacy and Usage Reminder */}
        <Disclaimer>
          <div className="text-sm">
            <p className="mb-2">
              <strong>Final Reminder:</strong> This is an educational research tool designed to 
              help you understand cardiovascular risk factors and potential interventions.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Results are approximations for educational purposes</li>
              <li>All data is processed locally and not transmitted</li>
              <li>Always consult healthcare providers for medical decisions</li>
              <li>Individual results may vary from calculated estimates</li>
            </ul>
          </div>
        </Disclaimer>
      </div>
    </Card>
  );
};

export default Step3LifestyleFactors;