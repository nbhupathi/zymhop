import React, { useState } from 'react';
import { 
  Search, CheckCircle, Clock, Calendar, X, ChevronDown, ChevronUp,
  AlertCircle, DollarSign, Loader2, RefreshCw
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookingSlot: string;
  checkInTime?: string;
  verified: boolean;
  upcomingBookings: Booking[];
  pastBookings: Booking[];
}

interface Booking {
  id: string;
  date: string;
  time: string;
  instructor: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  userName: string;
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onReschedule: (newDate: string, newTime: string) => void;
}

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onVerify, userName }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    setIsVerifying(true);
    setError('');

    try {
      if (otpString === '1111') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        onVerify();
        onClose();
        toast.success('OTP verified successfully');
      } else {
        setError('Invalid OTP. Please try again.');
        // Shake animation is handled by CSS
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-gray-900 mb-1">Verify OTP</h3>
        <p className="text-gray-600 mb-6">Enter the OTP for {userName}</p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`w-12 h-12 text-center text-2xl font-bold border rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${error ? 'animate-shake border-red-500' : 'border-gray-300'}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={otp.some(digit => !digit) || isVerifying}
          className={`w-full py-2 rounded-lg font-medium transition-colors
            ${isVerifying
              ? 'bg-gray-100 text-gray-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          {isVerifying ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Verifying...
            </div>
          ) : (
            'Verify OTP'
          )}
        </button>
      </div>
    </div>
  );
};

const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose, booking, onReschedule }) => {
  const [selectedDate, setSelectedDate] = useState(booking ? booking.date : '');
  const [selectedTime, setSelectedTime] = useState(booking ? booking.time : '');
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleReschedule = async () => {
    setIsRescheduling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onReschedule(selectedDate, selectedTime);
      onClose();
      toast.success('Booking rescheduled successfully');
    } catch (error) {
      toast.error('Failed to reschedule booking');
    } finally {
      setIsRescheduling(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Reschedule Booking</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={dayjs().format('YYYY-MM-DD')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a time</option>
              {Array.from({ length: 14 }, (_, i) => i + 6).map((hour) => (
                <option key={hour} value={`${hour}:00`}>
                  {`${hour}:00`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              disabled={!selectedDate || !selectedTime || isRescheduling}
              className={`px-4 py-2 rounded-lg text-white ${
                isRescheduling || !selectedDate || !selectedTime
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRescheduling ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Rescheduling...
                </div>
              ) : (
                'Reschedule'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ZymhopUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const users: User[] = [
    {
      id: 'U1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      bookingSlot: '09:00 AM',
      checkInTime: '09:05 AM',
      verified: true,
      upcomingBookings: [
        {
          id: 'B1',
          date: '2025-03-10',
          time: '09:00',
          instructor: 'Sarah Johnson',
          paymentStatus: 'paid'
        }
      ],
      pastBookings: [
        {
          id: 'B2',
          date: '2025-03-01',
          time: '10:00',
          instructor: 'Mike Wilson',
          paymentStatus: 'paid'
        }
      ]
    },
    {
      id: 'U2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '234-567-8901',
      bookingSlot: '10:00 AM',
      verified: false,
      upcomingBookings: [
        {
          id: 'B3',
          date: '2025-03-11',
          time: '14:00',
          instructor: 'Mike Wilson',
          paymentStatus: 'pending'
        }
      ],
      pastBookings: [
        {
          id: 'B4',
          date: '2025-03-02',
          time: '15:00',
          instructor: 'Sarah Johnson',
          paymentStatus: 'failed'
        }
      ]
    }
  ];

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})-(\d{3})-(\d{4})/, '***-***-$3');
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVerifyUser = (user: User) => {
    setSelectedUser(user);
    setShowOTPModal(true);
  };

  const handleOTPVerification = () => {
    // In a real application, this would make an API call
    console.log('User verified:', selectedUser?.id);
  };

  const handleRescheduleBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowRescheduleModal(true);
  };

  const handleReschedule = (newDate: string, newTime: string) => {
    // In a real application, this would make an API call
    console.log('Booking rescheduled:', { bookingId: selectedBooking?.id, newDate, newTime });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-500">There are no users matching your criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Time Filters */}
          <div className="flex space-x-4">
            {['today', 'this week', 'this month', 'all', 'one time'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeFilter === filter
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                      {user.verified ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm">Verified at {user.checkInTime}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleVerifyUser(user)}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          Verify OTP
                        </button>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-gray-600">{maskPhone(user.phone)}</p>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Booking Slot: {user.bookingSlot}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {expandedUser === user.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Expanded View */}
              {expandedUser === user.id && (
                <div className="mt-6 grid grid-cols-2 gap-6">
                  {/* Upcoming Bookings */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Upcoming Bookings</h4>
                    <div className="space-y-4">
                      {user.upcomingBookings.length > 0 ? (
                        user.upcomingBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="p-4 bg-white border rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-900">
                                  {dayjs(booking.date).format('MMM D, YYYY')}
                                </span>
                                <Clock className="w-4 h-4 text-gray-500 ml-2" />
                                <span className="text-sm text-gray-900">
                                  {booking.time}
                                </span>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                getPaymentStatusColor(booking.paymentStatus)
                              }`}>
                                {booking.paymentStatus.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Instructor: {booking.instructor}
                            </p>
                            <div className="mt-3 flex justify-end gap-2">
                              <button
                                onClick={() => handleRescheduleBooking(booking)}
                                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                              >
                                Reschedule
                              </button>
                              <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          No upcoming bookings
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Past Bookings */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Past Bookings</h4>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {user.pastBookings.length > 0 ? (
                        user.pastBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-900">
                                  {dayjs(booking.date).format('MMM D, YYYY')}
                                </span>
                                <Clock className="w-4 h-4 text-gray-500 ml-2" />
                                <span className="text-sm text-gray-900">
                                  {booking.time}
                                </span>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                getPaymentStatusColor(booking.paymentStatus)
                              }`}>
                                {booking.paymentStatus.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Instructor: {booking.instructor}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                          No past bookings
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {selectedUser && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerification}
          userName={selectedUser.name}
        />
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        booking={selectedBooking}
        onReschedule={handleReschedule}
      />
    </div>
  );
};

export default ZymhopUsers;