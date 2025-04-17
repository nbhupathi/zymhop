import React, { useState } from 'react';
import { DollarSign, TrendingUp, Download, Calendar, FileText, ChevronDown, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import dayjs from 'dayjs';

interface Earning {
  id: string;
  date: string;
  amount: number;
  type: 'session' | 'package' | 'commission';
  status: 'pending' | 'completed';
  client?: string;
  description: string;
}

interface EarningsTabProps {
  earnings: Earning[];
  onExport: (format: 'pdf' | 'excel') => void;
}

const EarningsTab: React.FC<EarningsTabProps> = ({
  earnings,
  onExport
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));

  // Calculate statistics
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = earnings
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount, 0);
  const completedEarnings = earnings
    .filter(e => e.status === 'completed')
    .reduce((sum, e) => sum + e.amount, 0);

  // Generate chart data
  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = dayjs().subtract(11 - i, 'month');
    const monthEarnings = earnings.filter(e => 
      dayjs(e.date).format('YYYY-MM') === month.format('YYYY-MM')
    );
    return {
      month: month.format('MMM'),
      amount: monthEarnings.reduce((sum, e) => sum + e.amount, 0),
      completed: monthEarnings
        .filter(e => e.status === 'completed')
        .reduce((sum, e) => sum + e.amount, 0),
      pending: monthEarnings
        .filter(e => e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0)
    };
  });

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ₹{totalEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Completed Payments</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ₹{completedEarnings.toLocaleString()}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Pending Payments</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            ₹{pendingEarnings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-gray-900">Earnings Overview</h3>
          <div className="flex items-center gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => onExport('pdf')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FileText className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => onExport('excel')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" stackId="a" />
              <Bar dataKey="pending" fill="#F59E0B" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Recent Transactions</h3>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {earnings
            .filter(earning => 
              dayjs(earning.date).format('YYYY-MM') === selectedMonth
            )
            .map((earning) => (
              <div key={earning.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        ₹{earning.amount.toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        earning.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {earning.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{earning.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {dayjs(earning.date).format('MMM D, YYYY')}
                    </p>
                    {earning.client && (
                      <p className="text-sm text-gray-500 mt-1">
                        Client: {earning.client}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsTab;