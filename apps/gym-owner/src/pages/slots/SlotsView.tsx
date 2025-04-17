import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, Clock, AlertCircle, Info, Calendar, CheckCircle, XCircle, ChevronUp, ChevronDown, KeyRound } from 'lucide-react';
import dayjs from 'dayjs';
import mockData from '../../data/Bookings.json';

interface Slot {
  id: string;
  time: string;
  status: 'available' | 'booked' | 'peak' | 'closed';
  capacity: number;
  booked: number;
  bookings: Array<{
    name: string;
    email: string;
    phone: string;
    booking_id: string;
    payment_status: string;
    status: string;
  }>;
  revenue?: number;
}

interface VerificationModalProps {
  booking: {
    name: string;
    booking_id: string;
    status: string;
  };
  onClose: () => void;
  onVerify: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ booking, onClose, onVerify }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (otp === '1111') {
      onVerify();
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Verify Booking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Booking ID: {booking.booking_id}</p>
            <p className="text-gray-600">Customer: {booking.name}</p>
            <p className="text-gray-600">Status: {booking.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP (1111)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter OTP"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SlotsView = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [draggedSlot, setDraggedSlot] = useState<Slot | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [selectedBookingIndex, setSelectedBookingIndex] = useState<number>(0);
  const [verificationModal, setVerificationModal] = useState<{
    show: boolean;
    booking: any;
    slotId: string;
  } | null>(null);

  // Filter bookings for selected date
  const dateBookings = useMemo(() => {
    return mockData.filter(booking => 
      dayjs(booking.date).isSame(selectedDate, 'day')
    );
  }, [selectedDate]);

  // Filter today's bookings
  const todayBookings = useMemo(() => {
    return mockData.filter(booking => 
      dayjs(booking.date).isSame(dayjs(), 'day')
    );
  }, []);

  // Generate time slots for the day
  const generateTimeSlots = () => {
    const slots: Slot[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00 AM`;
      const isPeakHour = (hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20);
      const isClosed = hour >= 21;
      const maxCapacity = isPeakHour ? 8 : 6;
      
      // Find all bookings for this time slot
      const slotBookings = dateBookings.filter(b => b.start_time === time);
      const bookedCount = slotBookings.length;

      slots.push({
        id: `slot-${hour}`,
        time,
        status: isClosed ? 'closed' : 
               bookedCount >= maxCapacity ? 'booked' : 
               isPeakHour ? 'peak' : 'available',
        capacity: maxCapacity,
        booked: bookedCount,
        bookings: slotBookings.map(booking => ({
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          booking_id: booking.booking_id,
          payment_status: booking.payment_status,
          status: booking.status
        })),
        revenue: slotBookings.reduce((sum, booking) => sum + booking.price, 0)
      });
    }
    return slots;
  };

  const slots = generateTimeSlots();

  const handleDateChange = (days: number) => {
    setSelectedDate(selectedDate.add(days, 'day'));
  };

  const handleDragStart = (slot: Slot) => {
    if (slot.status === 'booked') {
      setDraggedSlot(slot);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSlot: Slot) => {
    if (draggedSlot && targetSlot.status === 'available') {
      console.log(`Rescheduled from ${draggedSlot.time} to ${targetSlot.time}`);
    }
    setDraggedSlot(null);
  };

  const handleVerifyBooking = (booking: any, slotId: string) => {
    setVerificationModal({ show: true, booking, slotId });
  };

  const handleVerificationSuccess = () => {
    // In a real application, this would make an API call to update the booking status
    console.log('Booking verified successfully');
    setVerificationModal(null);
  };

  const getSlotColor = (slot: Slot) => {
    if (slot.status === 'closed') return 'bg-gray-100 border-gray-200';
    if (slot.booked === 0) return 'bg-blue-100 border-blue-200 hover:bg-blue-200';
    if (slot.booked >= slot.capacity) return 'bg-red-100 border-red-200 hover:bg-red-200';
    return 'bg-green-100 border-green-200 hover:bg-green-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'text-green-600';
      case 'Pending': return 'text-yellow-600';
      case 'Cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  // Calculate statistics
  const totalBookings = mockData.length;
  const todayTotalBookings = todayBookings.length;
  const selectedDateBookings = dateBookings.length;
  const totalRevenue = dateBookings.reduce((sum, booking) => sum + booking.price, 0);
  const cancellations = dateBookings.filter(booking => booking.status === 'Cancelled').length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Slots Overview</h1>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg font-medium">
                  {selectedDate.format('DD MMMM, YYYY')}
                </span>
                <button 
                  onClick={() => handleDateChange(1)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-600">All Time Bookings</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{todayTotalBookings}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-gray-600">Selected Date Bookings</p>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{selectedDateBookings}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-gray-600">Cancellations</p>
                </div>
                <p className="text-2xl font-bold text-red-600">{cancellations}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
                <p className="text-2xl font-bold text-purple-600">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                <span className="text-sm text-gray-600">Partially Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
                <span className="text-sm text-gray-600">Fully Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
                <span className="text-sm text-gray-600">Closed</span>
              </div>
            </div>
          </div>

          {/* Slots Grid */}
          <div className="p-6">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  draggable={slot.status === 'booked'}
                  onDragStart={() => handleDragStart(slot)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(slot)}
                  onMouseEnter={() => setShowTooltip(slot.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className={`relative p-4 rounded-lg border ${getSlotColor(slot)} 
                    transition-all duration-200 cursor-pointer`}
                >
                  <div className="text-sm font-medium text-gray-900">{slot.time}</div>
                  
                  {/* Capacity Progress Bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        slot.booked >= slot.capacity ? 'bg-red-500' : 
                        slot.booked > 0 ? 'bg-green-500' : 
                        'bg-blue-500'
                      }`}
                      style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-600">
                      {slot.booked}/{slot.capacity}
                    </span>
                  </div>

                  {/* Enhanced Tooltip */}
                  {showTooltip === slot.id && slot.status !== 'closed' && (
                    <div className="absolute z-10 w-80 p-4 bg-white rounded-lg shadow-lg border border-gray-200 -translate-y-full left-1/2 -translate-x-1/2 -mt-2">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-900">Slot Details</span>
                        <div className="flex items-center gap-2">
                          {slot.bookings.length > 0 && (
                            <>
                              <button
                                onClick={() => setSelectedBookingIndex(Math.max(0, selectedBookingIndex - 1))}
                                disabled={selectedBookingIndex === 0}
                                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-sm text-gray-600">
                                {selectedBookingIndex + 1}/{slot.bookings.length}
                              </span>
                              <button
                                onClick={() => setSelectedBookingIndex(Math.min(slot.bookings.length - 1, selectedBookingIndex + 1))}
                                disabled={selectedBookingIndex === slot.bookings.length - 1}
                                className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Capacity:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  slot.booked >= slot.capacity ? 'bg-red-500' : 
                                  slot.booked > 0 ? 'bg-green-500' : 
                                  'bg-blue-500'
                                }`}
                                style={{ width: `${(slot.booked / slot.capacity) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-900">{slot.booked}/{slot.capacity}</span>
                          </div>
                        </div>

                        {slot.bookings.length > 0 && (
                          <div className="border-t pt-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(slot.bookings[selectedBookingIndex].status)}
                                <span className={`font-medium ${getStatusColor(slot.bookings[selectedBookingIndex].status)}`}>
                                  {slot.bookings[selectedBookingIndex].status}
                                </span>
                              </div>
                              {slot.bookings[selectedBookingIndex].status === 'Pending' && (
                                <button
                                  onClick={() => handleVerifyBooking(slot.bookings[selectedBookingIndex], slot.id)}
                                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                                >
                                  <KeyRound className="w-4 h-4" />
                                  Verify
                                </button>
                              )}
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600">Booking ID: {slot.bookings[selectedBookingIndex].booking_id}</p>
                              <p className="text-gray-600">Customer: {slot.bookings[selectedBookingIndex].name}</p>
                              <p className="text-gray-600">Email: {slot.bookings[selectedBookingIndex].email}</p>
                              <p className="text-gray-600">Phone: {slot.bookings[selectedBookingIndex].phone}</p>
                              <p className="text-gray-600">Payment: {slot.bookings[selectedBookingIndex].payment_status}</p>
                            </div>
                          </div>
                        )}

                        {slot.revenue > 0 && (
                          <div className="border-t pt-3">
                            <p className="text-gray-600">
                              Revenue: <span className="font-medium">₹{slot.revenue.toFixed(2)}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="w-4 h-4" />
                <span>Drag and drop booked slots to reschedule</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Manage Slots
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {verificationModal && (
        <VerificationModal
          booking={verificationModal.booking}
          onClose={() => setVerificationModal(null)}
          onVerify={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

export default SlotsView;