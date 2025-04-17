import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Eye, KeyRound } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import mockData from '../../data/Bookings.json';

dayjs.extend(isSameOrAfter);

const UpcomingBookingsCard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedGym, setSelectedGym] = useState(0);

  const today = dayjs().format("YYYY-MM-DD");
  const gymNames = [...new Set(mockData.map((booking) => booking.gym_name))];
  const currentGym = gymNames[selectedGym];

  const filteredData = useMemo(() => {
    const gymBookings = mockData.filter(
      (booking) =>
        booking.gym_name === currentGym &&
        dayjs(booking.date).isSameOrAfter(today, "day")
    );

    return selectedDate
      ? gymBookings.filter((booking) =>
          dayjs(booking.date).isSame(dayjs(selectedDate), "day")
        )
      : gymBookings;
  }, [selectedDate, today, currentGym]);

  const totalAmount = filteredData.reduce((sum, booking) => sum + booking.price, 0).toFixed(2);
  const cancellations = filteredData.filter((booking) => booking.status === "Cancelled").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Gym Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {gymNames.map((gym, index) => (
            <button
              key={index}
              onClick={() => setSelectedGym(index)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                selectedGym === index
                  ? 'border-b-2 border-red-500 text-red-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {gym}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {currentGym} - Today's & Upcoming Bookings
          </h2>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-red-600">{filteredData.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Cancellations</p>
            <p className="text-2xl font-bold text-red-600">{cancellations}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-red-600">₹{totalAmount}</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((booking) => (
                  <tr
                    key={booking.booking_id}
                    className="hover:bg-red-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dayjs(booking.date).format("MM/DD/YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.booking_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {`${booking.start_time} - ${booking.end_time}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusIcon(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.location}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No bookings found for today or future dates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
            <Eye className="w-5 h-5 mr-2" />
            View All
          </button>
          <button className="inline-flex items-center px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
            <KeyRound className="w-5 h-5 mr-2" />
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingBookingsCard;