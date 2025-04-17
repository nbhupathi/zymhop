import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface TimeSlot {
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    date: string;
    time: string;
    instructor: string;
  } | null;
  onReschedule: (newDate: string, newTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReschedule
}) => {
  const [selectedDate, setSelectedDate] = useState(booking ? booking.date : '');
  const [selectedTime, setSelectedTime] = useState(booking ? booking.time : '');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

  // Simulate fetching available slots
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailableSlots = async () => {
      setIsCheckingAvailability(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        
        // Generate mock slots
        const slots: TimeSlot[] = Array.from({ length: 14 }, (_, i) => {
          const hour = i + 6;
          const isPeakHour = (hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20);
          const capacity = isPeakHour ? 20 : 15;
          const booked = Math.floor(Math.random() * capacity);
          
          return {
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: booked < capacity,
            capacity,
            booked
          };
        });

        setAvailableSlots(slots);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onReschedule(selectedDate, selectedTime);
      onClose();
      toast.success('Booking rescheduled successfully', {
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
    } catch (error) {
      toast.error('Failed to reschedule booking', {
        icon: <AlertCircle className="w-5 h-5 text-red-500" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Reschedule Booking</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Current Booking Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Current Booking</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700">
                      {dayjs(booking.date).format('MMM D, YYYY')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700">{booking.time}</span>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={dayjs().format('YYYY-MM-DD')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Time
                </label>
                {isCheckingAvailability ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                            : slot.available
                            ? 'bg-gray-50 text-gray-900 hover:bg-gray-100 border-2 border-transparent'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-transparent'
                        }`}
                      >
                        <div className="text-center">{slot.time}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {slot.booked}/{slot.capacity}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={!selectedDate || !selectedTime || isLoading}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  isLoading || !selectedDate || !selectedTime
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rescheduling...</span>
                  </div>
                ) : (
                  'Confirm Reschedule'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RescheduleModal;