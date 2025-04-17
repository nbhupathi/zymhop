import React, { useState } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import dayjs from 'dayjs';

const ActiveSlotsCard = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Generate slot data with capacity and bookings
  const slotData = Array.from({ length: 16 }, (_, i) => {
    const hour = 6 + i; // Start from 6 AM
    const isPeakHour = (hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20);
    const maxCapacity = isPeakHour ? 8 : 6;
    const bookedSlots = Math.floor(Math.random() * (maxCapacity + 1));
    
    return {
      time: `${hour.toString().padStart(2, '0')}:00`,
      booked: bookedSlots,
      available: maxCapacity - bookedSlots,
      isPeak: isPeakHour,
      utilization: (bookedSlots / maxCapacity) * 100
    };
  });

  const handleDateChange = (days: number) => {
    setSelectedDate(selectedDate.add(days, 'day'));
  };

  // Calculate statistics
  const totalBookings = slotData.reduce((sum, slot) => sum + slot.booked, 0);
  const peakUtilization = slotData
    .filter(slot => slot.isPeak)
    .reduce((sum, slot) => sum + slot.utilization, 0) / slotData.filter(slot => slot.isPeak).length;
  const offPeakUtilization = slotData
    .filter(slot => !slot.isPeak)
    .reduce((sum, slot) => sum + slot.utilization, 0) / slotData.filter(slot => !slot.isPeak).length;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Slot Utilization</h2>
            <p className="text-sm text-gray-500 mt-1">Track slot bookings and availability</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleDateChange(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-900">
              {selectedDate.format('DD MMM, YYYY')}
            </span>
            <button 
              onClick={() => handleDateChange(1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-red-600">{totalBookings}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Peak Utilization</p>
            <p className="text-2xl font-bold text-red-600">{Math.round(peakUtilization)}%</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Off-Peak Utilization</p>
            <p className="text-2xl font-bold text-red-600">{Math.round(offPeakUtilization)}%</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={slotData} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }} 
                stroke="#9ca3af"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar
                dataKey="booked"
                stackId="a"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                name="Booked Slots"
              />
              <Bar
                dataKey="available"
                stackId="a"
                fill="#E5E7EB"
                radius={[4, 4, 0, 0]}
                name="Available Slots"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-900">Peak Hours:</span>
              <span className="text-sm text-gray-600">6-9 AM, 5-8 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">Off-Peak:</span>
              <span className="text-sm text-gray-600">All other hours</span>
            </div>
          </div>
          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveSlotsCard;