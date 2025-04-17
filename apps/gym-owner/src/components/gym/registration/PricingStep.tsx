import React from 'react';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import { GymFormData } from '../../../types/gym';

interface PricingStepProps {
  formData: GymFormData;
  onChange: (data: Partial<GymFormData>) => void;
}

const PricingStep: React.FC<PricingStepProps> = ({ formData, onChange }) => {
  const addSubscriptionPlan = () => {
    const newPlan = {
      name: '',
      duration: 1,
      price: 0
    };
    onChange({
      subscriptionPlans: [...formData.subscriptionPlans, newPlan]
    });
  };

  const removePlan = (index: number) => {
    const newPlans = formData.subscriptionPlans.filter((_, i) => i !== index);
    onChange({ subscriptionPlans: newPlans });
  };

  const updatePlan = (index: number, field: string, value: string | number) => {
    const newPlans = formData.subscriptionPlans.map((plan, i) => {
      if (i === index) {
        return { ...plan, [field]: value };
      }
      return plan;
    });
    onChange({ subscriptionPlans: newPlans });
  };

  return (
    <div className="space-y-6">
      {/* Peak/Non-Peak Rates */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Hourly Rates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peak Hour Rate (₹)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.pricing.peak}
                onChange={(e) => onChange({
                  pricing: { ...formData.pricing, peak: Number(e.target.value) }
                })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter peak hour rate"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Non-Peak Hour Rate (₹)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                value={formData.pricing.nonPeak}
                onChange={(e) => onChange({
                  pricing: { ...formData.pricing, nonPeak: Number(e.target.value) }
                })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter non-peak hour rate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Subscription Plans</h3>
          <button
            onClick={addSubscriptionPlan}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        <div className="space-y-4">
          {formData.subscriptionPlans.map((plan, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => updatePlan(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter plan name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    value={plan.duration}
                    onChange={(e) => updatePlan(index, 'duration', Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter duration"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) => updatePlan(index, 'price', Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter price"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => removePlan(index)}
                className="mt-4 flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                Remove Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingStep;