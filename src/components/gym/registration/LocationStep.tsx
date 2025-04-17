import React from 'react';
import { GymFormData } from '../../../types/gym';

interface LocationStepProps {
  formData: GymFormData;
  onChange: (data: Partial<GymFormData>) => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => onChange({ address: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter complete address"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => onChange({ state: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter state"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ZIP Code *
        </label>
        <input
          type="text"
          value={formData.zipCode}
          onChange={(e) => onChange({ zipCode: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter ZIP code"
        />
      </div>
    </div>
  );
};

export default LocationStep;