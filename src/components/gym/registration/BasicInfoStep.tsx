import React from 'react';
import { GymFormData } from '../../../types/gym';

interface BasicInfoStepProps {
  formData: GymFormData;
  onChange: (data: Partial<GymFormData>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gym Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter gym name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Owner Name *
        </label>
        <input
          type="text"
          value={formData.ownerName}
          onChange={(e) => onChange({ ownerName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter owner name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Number *
        </label>
        <input
          type="tel"
          value={formData.contact}
          onChange={(e) => onChange({ contact: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter contact number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gym Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => onChange({ type: e.target.value as GymFormData['type'] })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="crossfit">CrossFit</option>
        </select>
      </div>
    </div>
  );
};

export default BasicInfoStep;