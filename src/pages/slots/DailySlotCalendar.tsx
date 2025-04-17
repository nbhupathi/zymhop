import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Lock, Tag, Users, AlertCircle, Settings } from 'lucide-react';
import dayjs from 'dayjs';

interface TimeSlot {
  time: string;
  isPeak: boolean;
  capacity: number;
  booked: number;
  isLocked: boolean;
  hasPromotion: boolean;
  waitlist: number;
  trainers: string[];
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [peakHours, setPeakHours] = useState({
    morning: { start: '05:00', end: '09:00' },
    evening: { start: '17:00', end: '21:00' }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Peak Hours Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Morning Peak</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={peakHours.morning.start}
                onChange={(e) => setPeakHours(prev => ({
                  ...prev,
                  morning: { ...prev.morning, start: e.target.value }
                }))}
                className="border rounded p-2"
              />
              <input
                type="time"
                value={peakHours.morning.end}
                onChange={(e) => setPeakHours(prev => ({
                  ...prev,
                  morning: { ...prev.morning, end: e.target.value }
                }))}
                className="border rounded p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Evening Peak</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"
                value={peakHours.evening.start}
                onChange={(e) => setPeakHours(prev => ({
                  ...prev,
                  evening: { ...prev.evening, start: e.target.value }
                }))}
                className="border rounded p-2"
              />
              <input
                type="time"
                value={peakHours.evening.end}
                onChange={(e) => setPeakHours(prev => ({
                  ...prev,
                  evening: { ...prev.evening, end: e.target.value }
                }))}
                className="border rounded p-2"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(peakHours);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DailySlotCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showSettings, setShowSettings] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>(() => 
    Array.from({ length: 18 }, (_, i) => {
      const hour = i + 5;
      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        isPeak: (hour >= 5 && hour <= 9) || (hour >= 17 && hour <= 21),
        capacity: 20,
        booked: Math.floor(Math.random() * 15),
        isLocked: false,
        hasPromotion: Math.random() > 0.8,
        waitlist: Math.floor(Math.random() * 5),
        trainers: ['John D.', 'Sarah M.'].filter(() => Math.random() > 0.5),
      };
    })
  );

  const handleDateChange = (days: number) => {
    setSelectedDate(selectedDate.add(days, 'day'));
  };

  const toggleLock = (index: number) => {
    setSlots(slots.map((slot, i) => 
      i === index ? { ...slot, isLocked: !slot.isLocked } : slot
    ));
  };

  const togglePromotion = (index: number) => {
    setSlots(slots.map((slot, i) => 
      i === index ? { ...slot, hasPromotion: !slot.hasPromotion } : slot
    ));
  };

  const handleSettingsSave = (settings: any) => {
    console.log('Saving peak hours settings:', settings);
    // Update slots based on new peak hours
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Daily Slot Calendar</h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-lg font-medium">
                    {selectedDate.format('DD MMMM, YYYY')}
                  </span>
                </div>
                <button 
                  onClick={() => handleDateChange(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
                <span className="text-sm">Peak Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Frozen Slot</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-500" />
                <span className="text-sm">Promotion Active</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Waitlist</span>
              </div>
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    slot.isLocked ? 'bg-gray-50 border-gray-300' :
                    slot.isPeak ? 'bg-yellow-50 border-yellow-200' :
                    'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{slot.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePromotion(index)}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          slot.hasPromotion ? 'text-green-500' : 'text-gray-400'
                        }`}
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleLock(index)}
                        className={`p-1 rounded hover:bg-gray-100 ${
                          slot.isLocked ? 'text-red-500' : 'text-gray-400'
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Capacity Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Capacity</span>
                        <span>{slot.booked}/{slot.capacity}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            (slot.booked / slot.capacity) > 0.8 ? 'bg-red-500' :
                            (slot.booked / slot.capacity) > 0.5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Trainers */}
                    {slot.trainers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {slot.trainers.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Waitlist */}
                    {slot.waitlist > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-orange-600">
                          {slot.waitlist} on waitlist
                        </span>
                      </div>
                    )}

                    {/* Status Indicators */}
                    <div className="flex flex-wrap gap-2">
                      {slot.isPeak && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Peak Hour
                        </span>
                      )}
                      {slot.hasPromotion && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Promotion
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
};

export default DailySlotCalendar;