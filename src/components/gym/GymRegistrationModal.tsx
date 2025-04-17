import React from 'react';
import { X } from 'lucide-react';
import { GymFormData } from '../../types/gym';
import RegistrationSteps from './registration/RegistrationSteps';
import BasicInfoStep from './registration/BasicInfoStep';
import LocationStep from './registration/LocationStep';
import AmenitiesStep from './registration/AmenitiesStep';
import MediaStep from './registration/MediaStep';
import PricingStep from './registration/PricingStep';
import ScheduleStep from './registration/ScheduleStep';
import PoliciesStep from './registration/PoliciesStep';

interface GymRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: GymFormData;
  currentStep: number;
  onStepChange: (step: number) => void;
  onFormChange: (data: Partial<GymFormData>) => void;
  onSubmit: () => void;
}

const GymRegistrationModal: React.FC<GymRegistrationModalProps> = ({
  isOpen,
  onClose,
  formData,
  currentStep,
  onStepChange,
  onFormChange,
  onSubmit
}) => {
  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep formData={formData} onChange={onFormChange} />;
      case 1:
        return <LocationStep formData={formData} onChange={onFormChange} />;
      case 2:
        return <AmenitiesStep formData={formData} onChange={onFormChange} />;
      case 3:
        return <MediaStep formData={formData} onChange={onFormChange} />;
      case 4:
        return <PricingStep formData={formData} onChange={onFormChange} />;
      case 5:
        return <ScheduleStep formData={formData} onChange={onFormChange} />;
      case 6:
        return <PoliciesStep formData={formData} onChange={onFormChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Register New Gym</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <RegistrationSteps currentStep={currentStep} onStepChange={onStepChange} />
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {renderStepContent()}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={() => onStepChange(currentStep - 1)}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentStep === 6) {
                  onSubmit();
                } else {
                  onStepChange(currentStep + 1);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentStep === 6 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymRegistrationModal;