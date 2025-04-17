import React from 'react';
import { GymFormData } from '../../../types/gym';
import { CheckCircle } from 'lucide-react';

interface AmenitiesStepProps {
  formData: GymFormData;
  onChange: (data: Partial<GymFormData>) => void;
}

const availableAmenities = [
  'Cardio Area',
  'Weight Training',
  'Yoga Studio',
  'Swimming Pool',
  'Sauna',
  'Steam Room',
  'Locker Room',
  'Shower',
  'Parking',
  'Wifi',
  'Cafe',
  'Pro Shop',
  'Personal Training',
  'Group Classes',
  'CrossFit Area',
  'Boxing Ring',
  'Basketball Court',
  'Childcare'
];

const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ formData, onChange }) => {
  const toggleAmenity = (amenity: string) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    onChange({ amenities: newAmenities });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableAmenities.map((amenity) => (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={`flex items-center gap-2 p-4 rounded-lg border transition-colors ${
                formData.amenities.includes(amenity)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                formData.amenities.includes(amenity)
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}>
                <CheckCircle className={`w-4 h-4 ${
                  formData.amenities.includes(amenity)
                    ? 'text-white'
                    : 'text-gray-400'
                }`} />
              </div>
              <span className="text-sm font-medium">{amenity}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          Selected Amenities: {formData.amenities.length}
        </p>
      </div>
    </div>
  );
};

export default AmenitiesStep;