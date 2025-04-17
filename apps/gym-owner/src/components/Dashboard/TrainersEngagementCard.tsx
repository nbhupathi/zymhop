import React, { useState } from 'react';
import { Users, Star, TrendingUp, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TrainersEngagementCard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const trainerData = [
    { name: 'John Smith', sessions: 24, rating: 4.8, clients: 18, expertise: 'Weight Training' },
    { name: 'Sarah Johnson', sessions: 18, rating: 4.9, clients: 15, expertise: 'Yoga' },
    { name: 'Mike Williams', sessions: 21, rating: 4.7, clients: 16, expertise: 'CrossFit' },
    { name: 'Emma Davis', sessions: 15, rating: 4.6, clients: 12, expertise: 'Cardio' },
    { name: 'Alex Brown', sessions: 20, rating: 4.8, clients: 14, expertise: 'HIIT' }
  ];

  const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const totalSessions = trainerData.reduce((sum, trainer) => sum + trainer.sessions, 0);
  const averageRating = (trainerData.reduce((sum, trainer) => sum + trainer.rating, 0) / trainerData.length).toFixed(1);
  const totalClients = trainerData.reduce((sum, trainer) => sum + trainer.clients, 0);

  // Custom legend renderer
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">Sessions: {data.sessions}</p>
          <p className="text-sm text-gray-600">Rating: {data.rating}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Trainer Performance</h2>
            <p className="text-sm text-gray-500 mt-1">Monitor trainer engagement and ratings</p>
          </div>
          <div className="flex gap-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-red-600" />
              <p className="text-sm text-gray-600">Total Sessions</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{totalSessions}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-red-600" />
              <p className="text-sm text-gray-600">Avg. Rating</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{averageRating}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <p className="text-sm text-gray-600">Active Clients</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{totalClients}</p>
          </div>
        </div>

        {/* Chart and Legend Container */}
        <div className="relative">
          {/* Chart */}
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trainerData}
                  dataKey="sessions"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                >
                  {trainerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  content={renderLegend}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trainer List */}
        <div className="mt-6 space-y-2 max-h-[200px] overflow-y-auto pr-2">
          {trainerData.map((trainer, index) => (
            <div
              key={trainer.name}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-8 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <p className="font-medium text-gray-900">{trainer.name}</p>
                  <p className="text-sm text-gray-500">{trainer.expertise}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{trainer.sessions} sessions</p>
                  <div className="flex items-center gap-1 text-sm text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{trainer.rating}</span>
                  </div>
                </div>
                <Award className={`w-5 h-5 ${index === 0 ? 'text-yellow-500' : 'text-gray-300'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainersEngagementCard;