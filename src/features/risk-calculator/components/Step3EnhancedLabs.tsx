import React, { useEffect } from 'react';
import { Input, Card, Disclaimer, SubtleMedicalTooltip } from '@/components/ui';
import { PatientParams } from '@/types';
import { calculateEGFR, calculateNonHDL } from '../services/clinicalUtils';
import { SUBTLE_MEDICAL_PARAMETERS } from '@/components/ui/SubtleMedicalTooltip';

interface Step3EnhancedLabsProps {
  formData: Partial<PatientParams> & { selectedAlgorithm?: 'PCE' | 'PREVENT' };
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
}

const Step3EnhancedLabs: React.FC<Step3EnhancedLabsProps> = ({
  formData,
  errors,
  updateField,
}) => {
  // Auto-calculate non-HDL cholesterol when total and HDL are available
  useEffect(() => {
    if (formData.totalCholesterol && formData.hdlCholesterol && !formData.nonHdlCholesterol) {
      const calculated = calculateNonHDL(formData.totalCholesterol, formData.hdlCholesterol);
      updateField('nonHdlCholesterol', calculated);
    }
  }, [formData.totalCholesterol, formData.hdlCholesterol, formData.nonHdlCholesterol, updateField]);

  // Auto-calculate eGFR when creatinine is available
  useEffect(() => {
    if (formData.creatinine && formData.age && formData.gender && !formData.eGFR) {
      try {
        const calculated = calculateEGFR({
          creatinine: formData.creatinine,
          age: formData.age,
          gender: formData.gender
        });
        updateField('eGFR', calculated);
      } catch (error) {
        console.warn('Could not calculate eGFR:', error);
      }
    }
  }, [formData.creatinine, formData.age, formData.gender, formData.eGFR, updateField]);

  return (
    <Card variant="medical" title="Enhanced Laboratory Values" subtitle="Step 3 of 4: Advanced parameters for PREVENT algorithm">
      <div className="space-y-6">
        {/* Algorithm Info */}
        <Disclaimer type="info">
          <p className="text-sm">
            <strong>PREVENT Enhancement:</strong> These additional laboratory values improve 
            risk prediction accuracy and enable both 10-year and 30-year cardiovascular risk estimates.
          </p>
        </Disclaimer>

        {/* Enhanced Cholesterol Section */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
            </svg>
            <SubtleMedicalTooltip parameter={SUBTLE_MEDICAL_PARAMETERS.nonHdlCholesterol} mode="subtle">
              Non-HDL Cholesterol (Required)
            </SubtleMedicalTooltip>
          </h4>
          
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Non-HDL Cholesterol"
              name="nonHdlCholesterol"
              type="number"
              value={formData.nonHdlCholesterol || ''}
              onChange={(value) => updateField('nonHdlCholesterol', Number(value) || undefined)}
              placeholder="150"
              min={100}
              max={300}
              required
              error={errors.nonHdlCholesterol}
              help="mg/dL - Total cholesterol minus HDL cholesterol"
            />
          </div>

          {formData.totalCholesterol && formData.hdlCholesterol && (
            <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800">
              <strong>Calculated:</strong> Non-HDL = {formData.totalCholesterol} - {formData.hdlCholesterol} = {calculateNonHDL(formData.totalCholesterol, formData.hdlCholesterol)} mg/dL
            </div>
          )}
        </div>

        {/* Kidney Function Section */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <h4 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <SubtleMedicalTooltip parameter={SUBTLE_MEDICAL_PARAMETERS.eGFR} mode="subtle">
              Kidney Function (Required)
            </SubtleMedicalTooltip>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Input
                label={(
                  <SubtleMedicalTooltip parameter={SUBTLE_MEDICAL_PARAMETERS.eGFR} mode="minimal">
                    eGFR
                  </SubtleMedicalTooltip>
                )}
                name="eGFR"
                type="number"
                value={formData.eGFR || ''}
                onChange={(value) => updateField('eGFR', Number(value) || undefined)}
                placeholder="90"
                min={10}
                max={150}
                error={errors.eGFR}
                help="mL/min/1.73m² - Kidney function estimate"
              />
            </div>
            
            <Input
              label="Serum Creatinine (Alternative)"
              name="creatinine"
              type="number"
              value={formData.creatinine || ''}
              onChange={(value) => updateField('creatinine', Number(value) || undefined)}
              placeholder="1.0"
              min={0.3}
              max={10}
              step={0.1}
              error={errors.creatinine}
              help="mg/dL - Used to calculate eGFR if not provided"
            />
          </div>

          {formData.creatinine && formData.age && formData.gender && (
            <div className="mt-3 p-2 bg-emerald-100 rounded text-sm text-emerald-800">
              <strong>Calculated eGFR:</strong> {
                (() => {
                  try {
                    return calculateEGFR({
                      creatinine: formData.creatinine,
                      age: formData.age,
                      gender: formData.gender
                    });
                  } catch {
                    return 'Unable to calculate';
                  }
                })()
              } mL/min/1.73m² (CKD-EPI 2021 equation)
            </div>
          )}

          {/* Optional: Albuminuria */}
          <div className="mt-4">
            <Input
              label="Albumin-Creatinine Ratio (Optional)"
              name="albuminCreatinineRatio"
              type="number"
              value={formData.albuminCreatinineRatio || ''}
              onChange={(value) => updateField('albuminCreatinineRatio', Number(value) || undefined)}
              placeholder="15"
              min={0}
              max={1000}
              error={errors.albuminCreatinineRatio}
              help="mg/g - Urine albumin-to-creatinine ratio"
            />
          </div>
        </div>

        {/* Statin Use Section */}
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Statin Therapy (Required)
          </h4>
          
          <div className="space-y-3">
            <p className="text-sm text-orange-800 mb-3">
              Are you currently taking statin medication for cholesterol management?
            </p>
            
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="statinUse"
                  value="true"
                  checked={formData.statinUse === true}
                  onChange={() => updateField('statinUse', true)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">Yes, currently taking statin</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="statinUse"
                  value="false"
                  checked={formData.statinUse === false}
                  onChange={() => updateField('statinUse', false)}
                  className="mr-2 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm">No, not taking statin</span>
              </label>
            </div>
            
            {errors.statinUse && (
              <p className="text-red-600 text-sm mt-1">{errors.statinUse}</p>
            )}
            
            <div className="text-xs text-orange-700 mt-2">
              Common statins include: atorvastatin (Lipitor), simvastatin (Zocor), rosuvastatin (Crestor), pravastatin (Pravachol)
            </div>
          </div>
        </div>

        {/* Enhanced Diabetes Management */}
        {formData.diabetes && (
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Diabetes Management (Optional)
            </h4>
            
            <Input
              label="HbA1c (Hemoglobin A1c)"
              name="hba1c"
              type="number"
              value={formData.hba1c || ''}
              onChange={(value) => updateField('hba1c', Number(value) || undefined)}
              placeholder="7.0"
              min={4}
              max={15}
              step={0.1}
              error={errors.hba1c}
              help="% - Average blood sugar control over 2-3 months"
            />

            <Disclaimer type="info" className="mt-3">
              <p className="text-sm">
                HbA1c helps assess diabetes control. Target is typically &lt;7% for most adults with diabetes.
              </p>
            </Disclaimer>
          </div>
        )}

        {/* Clinical Context */}
        <Disclaimer>
          <div className="text-sm space-y-2">
            <p><strong>Laboratory Value Tips:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Use values from recent laboratory tests (within 3 months)</li>
              <li>Fasting values are preferred for cholesterol measurements</li>
              <li>eGFR automatically accounts for age and gender using CKD-EPI 2021 equation</li>
              <li>Contact your healthcare provider if you need recent lab results</li>
            </ul>
          </div>
        </Disclaimer>
      </div>
    </Card>
  );
};

export default Step3EnhancedLabs;