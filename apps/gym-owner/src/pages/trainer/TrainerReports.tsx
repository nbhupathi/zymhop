import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Star, DollarSign, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';

interface TrainerStats {
  id: string;
  name: string;
  image: string;
  totalSessions: number;
  rating: number;
  earnings: number;
  attendance: number;
  peakHourSessions: number;
  specialization: string;
}

const TrainerReports = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const trainers: TrainerStats[] = [
    {
      id: 'T1',
      name: 'John Smith',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&h=150&fit=crop',
      totalSessions: 45,
      rating: 4.8,
      earnings: 33750,
      attendance: 95,
      peakHourSessions: 28,
      specialization: 'Strength Training'
    },
    {
      id: 'T2',
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      totalSessions: 38,
      rating: 4.9,
      earnings: 28500,
      attendance: 98,
      peakHourSessions: 22,
      specialization: 'Yoga'
    },
    {
      id: 'T3',
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop',
      totalSessions: 42,
      rating: 4.7,
      earnings: 31500,
      attendance: 92,
      peakHourSessions: 25,
      specialization: 'CrossFit'
    }
  ];

  const sessionData = [
    { name: 'Mon', sessions: 15 },
    { name: 'Tue', sessions: 12 },
    { name: 'Wed', sessions: 18 },
    { name: 'Thu', sessions: 14 },
    { name: 'Fri', sessions: 16 },
    { name: 'Sat', sessions: 10 },
    { name: 'Sun', sessions: 8 }
  ];

  const specializationData = [
    { name: 'Strength Training', value: 45 },
    { name: 'Yoga', value: 38 },
    { name: 'CrossFit', value: 42 },
    { name: 'HIIT', value: 25 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const handleDateChange = (days: number) => {
    setSelectedDate(selectedDate.add(days, 'day'));
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trainer Reports</h1>
                <p className="text-gray-600 mt-1">Performance analytics and insights</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleDateChange(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-lg font-medium">
                    {selectedDate.format('MMMM D, YYYY')}
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

            {/* Period Selector */}
            <div className="flex gap-2 mt-6">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedPeriod === period
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-4 gap-6 p-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Total Sessions</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {trainers.reduce((sum, t) => sum + t.totalSessions, 0)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Avg. Rating</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {(trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1)}
              </p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Total Earnings</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                ₹{trainers.reduce((sum, t) => sum + t.earnings, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">Peak Hour Sessions</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {trainers.reduce((sum, t) => sum + t.peakHourSessions, 0)}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="p-6 grid grid-cols-2 gap-6">
            {/* Sessions Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Sessions Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Specialization Distribution */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specialization Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={specializationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {specializationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {specializationData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trainer Performance Table */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trainer Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trainer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peak Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trainers.map((trainer) => (
                    <tr key={trainer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={trainer.image}
                            alt={trainer.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {trainer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {trainer.specialization}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {trainer.totalSessions}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {renderStars(trainer.rating)}
                          <span className="text-sm text-gray-500">
                            ({trainer.rating})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{trainer.earnings.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${trainer.attendance}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {trainer.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trainer.peakHourSessions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerReports;