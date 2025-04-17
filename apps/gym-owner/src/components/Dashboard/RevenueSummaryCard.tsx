import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import mockData from '../../data/Bookings.json';
import dayjs from 'dayjs';

const RevenueSummaryCard = () => {
  const today = dayjs();
  const todayRevenue = mockData
    .filter(booking => dayjs(booking.date).isSame(today, 'day'))
    .reduce((sum, booking) => sum + booking.price, 0);

  const thisWeekRevenue = mockData
    .filter(booking => dayjs(booking.date).isSame(today, 'week'))
    .reduce((sum, booking) => sum + booking.price, 0);

  const thisMonthRevenue = mockData
    .filter(booking => dayjs(booking.date).isSame(today, 'month'))
    .reduce((sum, booking) => sum + booking.price, 0);

  // Generate data for the chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().subtract(i, 'day');
    const revenue = mockData
      .filter(booking => dayjs(booking.date).isSame(date, 'day'))
      .reduce((sum, booking) => sum + booking.price, 0);
    return {
      date: date.format('DD MMM'),
      revenue
    };
  }).reverse();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Revenue Summary</h2>
        <Wallet className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-xl font-bold text-gray-900">₹{todayRevenue.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-xl font-bold text-gray-900">₹{thisWeekRevenue.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-xl font-bold text-gray-900">₹{thisMonthRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-48 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={last7Days}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#EF4444"
              fill="url(#revenueGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <button className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
        <span className="font-medium">View Wallet</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default RevenueSummaryCard;