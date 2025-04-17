import React from 'react';
import { Clock } from 'lucide-react';
import { GymFormData } from '../../../types/gym';

interface ScheduleStepProps {
  formData: GymFormData;
  onChange: (data: Partial<GymFormData>) => void;
}

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const ScheduleStep: React.FC<ScheduleStepProps> = ({ formData, onChange }) => {
  const toggleClosedDay = (day: string) => {
    const newClosedDays = formData.closedDays.includes(day)
      ? formData.closedDays.filter(d => d !== day)
      : [...formData.closedDays, day];
    onChange({ closedDays: newClosedDays });
  };

  return (
    <div className="space-y-6">
      {/* Working Hours */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Working Hours</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opening Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                value={formData.workingHours.open}
                onChange={(e) => onChange({
                  workingHours: { ...formData.workingHours, open: e.target.value }
                })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closing Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                value={formData.workingHours.close}
                onChange={(e) => onChange({
                  workingHours: { ...formData.workingHours, close: e.target.value }
                })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Closed Days */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Closed Days</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => toggleClosedDay(day)}
              className={`p-4 rounded-lg border transition-colors ${
                formData.closedDays.includes(day)
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-red-500'
              }`}
            >
              <span className="text-sm font-medium">{day}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          Note: Make sure to set appropriate working hours and mark any regular closing days.
          This will help in managing slot bookings effectively.
        </p>
      </div>
    </div>
  );
};

export default ScheduleStep;