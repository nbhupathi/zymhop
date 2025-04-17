import React from 'react';
import { Building2, MapPin, Dumbbell, Image as ImageIcon, DollarSign, Clock, FileText } from 'lucide-react';

interface RegistrationStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { icon: Building2, label: 'Basic Info' },
  { icon: MapPin, label: 'Location' },
  { icon: Dumbbell, label: 'Amenities' },
  { icon: ImageIcon, label: 'Media' },
  { icon: DollarSign, label: 'Pricing' },
  { icon: Clock, label: 'Schedule' },
  { icon: FileText, label: 'Policies' }
];

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
  currentStep,
  onStepChange
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => onStepChange(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                index === currentStep
                  ? 'bg-blue-50 text-blue-600'
                  : index < currentStep
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <step.icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden md:inline">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RegistrationSteps;