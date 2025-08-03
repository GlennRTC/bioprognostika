import React from 'react';
import { Input, Card, Disclaimer } from '@/components/ui';
import { PatientParams } from '@/types';

interface Step1DemographicsProps {
  formData: Partial<PatientParams>;
  errors: Record<string, string>;
  updateField: (field: keyof PatientParams, value: any) => void;
}

const Step1Demographics: React.FC<Step1DemographicsProps> = ({
  formData,
  errors,
  updateField,
}) => {
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary / Other' },
  ];

  const raceOptions = [
    { value: 'white', label: 'Non-Hispanic White' },
    { value: 'black', label: 'Non-Hispanic Black / African American' },
    { value: 'other', label: 'Other Race / Ethnicity' },
  ];

  return (
    <Card variant="medical" title="Basic Information" subtitle="Step 1 of 3: Tell us about yourself">
      <div className="space-y-6">
        {/* Age Input */}
        <Input
          label="Age"
          name="age"
          type="number"
          value={formData.age || ''}
          onChange={(value) => updateField('age', Number(value))}
          placeholder="Enter your age"
          min={40}
          max={79}
          required
          error={errors.age}
          help="This calculator is validated for ages 40-79 years"
        />

        {/* Gender Selection */}
        <Input
          label="Gender"
          name="gender"
          type="select"
          value={formData.gender || ''}
          onChange={(value) => updateField('gender', value)}
          options={genderOptions}
          required
          error={errors.gender}
          help="Biological sex assigned at birth for medical calculation purposes"
        />

        {/* Race/Ethnicity Selection */}
        <Input
          label="Race / Ethnicity"
          name="race"
          type="select"
          value={formData.race || ''}
          onChange={(value) => updateField('race', value)}
          options={raceOptions}
          required
          error={errors.race}
          help="Used for population-specific risk calculation accuracy"
        />

        {/* Information about non-binary calculations */}
        {formData.gender === 'non-binary' && (
          <Disclaimer type="info">
            <p className="text-sm">
              <strong>Non-binary gender calculation:</strong> Risk will be estimated using averaged 
              male and female calculations due to limited research data for non-binary populations. 
              Results may have lower confidence intervals.
            </p>
          </Disclaimer>
        )}

        {/* Information about race-based calculations */}
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
};

export default Step1Demographics;