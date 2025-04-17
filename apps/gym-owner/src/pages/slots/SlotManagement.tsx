import React, { useState } from 'react';
import { Calendar, Clock, Users, AlertCircle, Ban, Tag, UserPlus, Bell, Gift, Settings, X } from 'lucide-react';
import dayjs from 'dayjs';

interface Trainer {
  id: string;
  name: string;
  specialization: string;
  availability: boolean;
}

interface SlotSettings {
  peakHourRate: number;
  offPeakRate: number;
  maxCapacity: number;
  autoReleaseWindow: number;
  waitlistLimit: number;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  isPeak: boolean;
  capacity: number;
  bookedCount: number;
  trainers: Trainer[];
  isBlocked: boolean;
  waitlist: string[];
  price: number;
}

interface SettingsModalProps {
  settings: SlotSettings;
  onSave: (newSettings: SlotSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [formData, setFormData] = useState<SlotSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Slot Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peak Hour Rate (₹)
            </label>
            <input
              type="number"
              name="peakHourRate"
              value={formData.peakHourRate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Off-Peak Rate (₹)
            </label>
            <input
              type="number"
              name="offPeakRate"
              value={formData.offPeakRate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Capacity
            </label>
            <input
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auto Release Window (days)
            </label>
            <input
              type="number"
              name="autoReleaseWindow"
              value={formData.autoReleaseWindow}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waitlist Limit
            </label>
            <input
              type="number"
              name="waitlistLimit"
              value={formData.waitlistLimit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SlotManagement = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<SlotSettings>({
    peakHourRate: 500,
    offPeakRate: 300,
    maxCapacity: 20,
    autoReleaseWindow: 10,
    waitlistLimit: 5
  });

  const [trainers] = useState<Trainer[]>([
    { id: 'T1', name: 'John Smith', specialization: 'Strength Training', availability: true },
    { id: 'T2', name: 'Sarah Johnson', specialization: 'Yoga', availability: true },
    { id: 'T3', name: 'Mike Wilson', specialization: 'CrossFit', availability: true }
  ]);

  const generateTimeSlots = (): Slot[] => {
    const slots: Slot[] = [];
    for (let hour = 5; hour < 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const isPeak = (hour >= 5 && hour < 9) || (hour >= 17 && hour < 21);
      
      slots.push({
        id: `slot-${hour}`,
        startTime,
        endTime,
        isPeak,
        capacity: settings.maxCapacity,
        bookedCount: Math.floor(Math.random() * settings.maxCapacity),
        trainers: trainers.filter(() => Math.random() > 0.5),
        isBlocked: false,
        waitlist: [],
        price: isPeak ? settings.peakHourRate : settings.offPeakRate
      });
    }
    return slots;
  };

  const [slots, setSlots] = useState<Slot[]>(generateTimeSlots());

  const handleSettingsSave = (newSettings: SlotSettings) => {
    setSettings(newSettings);
    // Regenerate slots with new settings
    setSlots(generateTimeSlots());
  };

  const handleBlockSlot = (slotId: string) => {
    setSlots(slots.map(slot => 
      slot.id === slotId ? { ...slot, isBlocked: !slot.isBlocked } : slot
    ));
  };

  const getSlotColor = (slot: Slot) => {
    if (slot.isBlocked) return 'bg-gray-100 border-gray-200';
    if (slot.bookedCount >= slot.capacity) return 'bg-red-50 border-red-200';
    if (slot.waitlist.length > 0) return 'bg-yellow-50 border-yellow-200';
    if (slot.isPeak) return 'bg-blue-50 border-blue-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Slot Management</h1>
            <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Peak Hours Rate</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">₹{settings.peakHourRate}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Max Capacity</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{settings.maxCapacity}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Auto Release</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{settings.autoReleaseWindow} days</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Active Promotions</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
          </div>
        </div>

        {/* Trainers Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Trainers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trainers.map(trainer => (
              <div key={trainer.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{trainer.name}</p>
                  <p className="text-sm text-gray-600">{trainer.specialization}</p>
                </div>
                <div className={`ml-auto px-2 py-1 rounded text-xs ${
                  trainer.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {trainer.availability ? 'Available' : 'Busy'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slots Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDate.format('MMMM D, YYYY')}
                </h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedDate(selectedDate.subtract(1, 'day'))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  Previous
                </button>
                <button
                  onClick={() => setSelectedDate(dayjs())}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  Today
                </button>
                <button 
                  onClick={() => setSelectedDate(selectedDate.add(1, 'day'))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-50 border border-blue-200" />
                <span className="text-sm text-gray-600">Peak Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-50 border border-red-200" />
                <span className="text-sm text-gray-600">Full</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-50 border border-yellow-200" />
                <span className="text-sm text-gray-600">Waitlist</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
                <span className="text-sm text-gray-600">Blocked</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {slots.map(slot => (
                <div
                  key={slot.id}
                  className={`${getSlotColor(slot)} p-4 rounded-lg border relative group`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <button
                      onClick={() => handleBlockSlot(slot.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Ban className="w-4 h-4 text-gray-500 hover:text-red-500" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {slot.bookedCount}/{slot.capacity}
                      </span>
                    </div>

                    {slot.isPeak && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-600">Peak Hour</span>
                      </div>
                    )}

                    {slot.waitlist.length > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-600">
                          Waitlist: {slot.waitlist.length}
                        </span>
                      </div>
                    )}

                    <div className="text-sm font-medium text-gray-900">
                      ₹{slot.price}
                    </div>
                  </div>

                  {slot.trainers.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="flex -space-x-2">
                        {slot.trainers.map(trainer => (
                          <div
                            key={trainer.id}
                            className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white"
                            title={trainer.name}
                          >
                            <span className="text-xs font-medium text-blue-600">
                              {trainer.name[0]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSettingsSave}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};

export default SlotManagement;