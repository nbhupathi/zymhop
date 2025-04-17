import React from 'react';
import { GymFormData } from '../../../types/gym';

interface PoliciesStepProps {
  formData: GymFormData;
  onChange: (data: Partial<GymFormData>) => void;
}

const PoliciesStep: React.FC<PoliciesStepProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cancellation Policy
        </label>
        <textarea
          value={formData.policies.cancellation}
          onChange={(e) => onChange({
            policies: { ...formData.policies, cancellation: e.target.value }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter cancellation policy details"
          rows={4}
        />
        <p className="mt-1 text-sm text-gray-500">
          Explain your cancellation policy, including any fees or notice periods required.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Refund Policy
        </label>
        <textarea
          value={formData.policies.refund}
          onChange={(e) => onChange({
            policies: { ...formData.policies, refund: e.target.value }
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter refund policy details"
          rows={4}
        />
        <p className="mt-1 text-sm text-gray-500">
          Explain your refund policy, including conditions and processing time.
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          Important: Make sure your policies comply with local regulations and are clearly
          communicated to avoid any misunderstandings with members.
        </p>
      </div>
    </div>
  );
};

export default PoliciesStep;