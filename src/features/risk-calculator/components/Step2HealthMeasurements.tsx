import React from 'react';
import { Input, Card, Disclaimer } from '@/components/ui';
import { PatientParams } from '@/types';

interface Step2HealthMeasurementsProps {
  formData: Partial<PatientParams> & { selectedAlgorithm?: 'PCE' | 'PREVENT' };
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
}

const Step2HealthMeasurements: React.FC<Step2HealthMeasurementsProps> = ({
  formData,
  errors,
  updateField,
}) => {
  return (
    <Card variant="medical" title="Health Measurements" subtitle="Step 2 of 3: Your current health metrics">
      <div className="space-y-6">
        {/* Blood Pressure Section */}
        <div className="bg-primary-50 p-4 rounded-xl border border-primary-200">
          <h4 className="text-lg font-semibold text-primary-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Blood Pressure (Required)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Systolic Blood Pressure"
              name="systolicBP"
              type="number"
              value={formData.systolicBP || ''}
              onChange={(value) => updateField('systolicBP', Number(value))}
              placeholder="120"
              min={90}
              max={200}
              required
              error={errors.systolicBP}
              help="Top number (mmHg)"
            />
            
            <Input
              label="Diastolic Blood Pressure"
              name="diastolicBP"
              type="number"
              value={formData.diastolicBP || ''}
              onChange={(value) => updateField('diastolicBP', Number(value))}
              placeholder="80"
              min={60}
              max={120}
              error={errors.diastolicBP}
              help="Bottom number (mmHg) - Optional"
            />
          </div>

          {/* BP Medication Question */}
          <div className="mt-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.bpMedication || false}
                onChange={(e) => updateField('bpMedication', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">
                I am currently taking blood pressure medication
              </span>
            </label>
          </div>
        </div>

        {/* Cholesterol Section */}
        <div className="bg-healing-sage/10 p-4 rounded-xl border border-healing-sage/30">
          <h4 className="text-lg font-semibold text-healing-earth mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
            </svg>
            Cholesterol Levels (Optional)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Total Cholesterol"
              name="totalCholesterol"
              type="number"
              value={formData.totalCholesterol || ''}
              onChange={(value) => updateField('totalCholesterol', Number(value) || undefined)}
              placeholder="200"
              min={130}
              max={320}
              error={errors.totalCholesterol}
              help="mg/dL - Leave blank if unknown"
            />
            
            <Input
              label="HDL Cholesterol"
              name="hdlCholesterol"
              type="number"
              value={formData.hdlCholesterol || ''}
              onChange={(value) => updateField('hdlCholesterol', Number(value) || undefined)}
              placeholder="50"
              min={20}
              max={100}
              error={errors.hdlCholesterol}
              help='mg/dL - "Good" cholesterol'
            />
          </div>

          <Disclaimer type="info" className="mt-4">
            <p className="text-sm">
              <strong>Don't have recent cholesterol values?</strong> The calculator will use 
              population average values (Total: 200 mg/dL, HDL: 50 mg/dL) for estimation. 
              For more accurate results, consider getting a lipid panel from your healthcare provider.
            </p>
          </Disclaimer>
        </div>

        {/* Medical Conditions */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <h4 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Medical History
          </h4>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.diabetes || false}
                onChange={(e) => updateField('diabetes', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">
                I have diabetes (Type 1 or Type 2)
              </span>
            </label>

            {/* PREVENT-specific: Statin use */}
            {formData.selectedAlgorithm === 'PREVENT' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="text-md font-medium text-blue-900 mb-2">
                  Current Medications (Required for PREVENT)
                </h5>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.statinUse || false}
                    onChange={(e) => updateField('statinUse', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-neutral-700">
                    I am currently taking a statin medication (cholesterol-lowering drug)
                  </span>
                </label>
                {errors.statinUse && (
                  <p className="text-red-600 text-xs mt-1">{errors.statinUse}</p>
                )}
              </div>
            )}
          </div>
        </div>

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
};

export default Step2HealthMeasurements;