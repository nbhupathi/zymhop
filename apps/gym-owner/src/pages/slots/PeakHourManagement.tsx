import React, { useState } from 'react';
import { Clock, DollarSign, TrendingUp, Users, Settings } from 'lucide-react';
import dayjs from 'dayjs';

interface PeakHour {
  start: string;
  end: string;
  rate: number;
  capacity: number;
}

const PeakHourManagement = () => {
  const [peakHours, setPeakHours] = useState<{
    morning: PeakHour;
    evening: PeakHour;
  }>({
    morning: {
      start: '06:00',
      end: '09:00',
      rate: 500,
      capacity: 20
    },
    evening: {
      start: '17:00',
      end: '20:00',
      rate: 500,
      capacity: 20
    }
  });

  const [offPeakRate, setOffPeakRate] = useState(300);
  const [selectedDay, setSelectedDay] = useState(dayjs());

  const handlePeakHourChange = (period: 'morning' | 'evening', field: keyof PeakHour, value: string | number) => {
    setPeakHours(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Peak Hour Management</h1>
              <p className="text-gray-600 mt-1">Configure peak hours and pricing</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Settings className="w-4 h-4" />
              Save Settings
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Peak Hours</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">6 Hours</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Peak Rate</span>
              </div>
              <p className="text-2xl font-bold text-green-600">₹{peakHours.morning.rate}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Off-Peak Rate</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">₹{offPeakRate}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Peak Capacity</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{peakHours.morning.capacity}</p>
            </div>
          </div>

          {/* Peak Hours Configuration */}
          <div className="space-y-6">
            {/* Morning Peak */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Morning Peak Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={peakHours.morning.start}
                    onChange={(e) => handlePeakHourChange('morning', 'start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={peakHours.morning.end}
                    onChange={(e) => handlePeakHourChange('morning', 'end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    value={peakHours.morning.rate}
                    onChange={(e) => handlePeakHourChange('morning', 'rate', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={peakHours.morning.capacity}
                    onChange={(e) => handlePeakHourChange('morning', 'capacity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Evening Peak */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Evening Peak Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={peakHours.evening.start}
                    onChange={(e) => handlePeakHourChange('evening', 'start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={peakHours.evening.end}
                    onChange={(e) => handlePeakHourChange('evening', 'end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    value={peakHours.evening.rate}
                    onChange={(e) => handlePeakHourChange('evening', 'rate', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={peakHours.evening.capacity}
                    onChange={(e) => handlePeakHourChange('evening', 'capacity', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Off-Peak Configuration */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Off-Peak Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    value={offPeakRate}
                    onChange={(e) => setOffPeakRate(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeakHourManagement;