import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Bell, CheckCircle, XCircle, AlertCircle,
  Download, FileText, TrendingUp, User, Phone, Search,
  Mail, ChevronLeft, ChevronRight, Filter, QrCode, Users
} from 'lucide-react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { QRCodeSVG } from 'qrcode.react';

// Extend dayjs with isBetween plugin
dayjs.extend(isBetween);

interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
  lastCheckIn: string;
  status: 'verified' | 'unverified';
  notificationCount: number;
}

interface CheckInStats {
  dailyCount: number;
  averageTime: string;
  complianceRate: number;
  totalUsers: number;
}

const CheckInHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'unverified'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD'),
  });

  // Mock users data
  const [users] = useState<User[]>(Array.from({ length: 20 }, (_, i) => ({
    id: `U${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    photo: `https://i.pravatar.cc/150?u=${i + 1}`,
    lastCheckIn: dayjs().subtract(Math.floor(Math.random() * 24), 'hours').format(),
    status: Math.random() > 0.3 ? 'verified' : 'unverified',
    notificationCount: Math.floor(Math.random() * 5),
  })));

  // Mock statistics
  const [stats] = useState<CheckInStats>({
    dailyCount: 156,
    averageTime: '09:30 AM',
    complianceRate: 87.5,
    totalUsers: users.length,
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Check-in History Report', 20, 20);
      doc.save('check-in-report.pdf');
      toast.success('PDF exported successfully');
    } else {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(wb, ws, 'Check-ins');
      XLSX.writeFile(wb, 'check-in-report.xlsx');
      toast.success('Excel exported successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - User Management */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setUserFilter('all')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                    userFilter === 'all'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setUserFilter('unverified')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                    userFilter === 'unverified'
                      ? 'bg-yellow-50 text-yellow-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Unverified
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={user.photo}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                          {user.notificationCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                              {user.notificationCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Last check-in: {dayjs(user.lastCheckIn).format('HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Check-in Functions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Daily Check-ins</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.dailyCount}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Average Time</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.averageTime}</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">Compliance Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-gray-600">Total Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Quick Check-in</h2>
                <button
                  onClick={() => setShowQRScanner(!showQRScanner)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <QrCode className="w-4 h-4" />
                  {showQRScanner ? 'Hide Scanner' : 'Show Scanner'}
                </button>
              </div>

              {showQRScanner && (
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                  <QRCodeSVG
                    value={JSON.stringify({
                      type: 'check-in',
                      timestamp: new Date().toISOString(),
                    })}
                    size={200}
                    level="H"
                  />
                </div>
              )}
            </div>

            {/* Calendar and Export Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Check-in History</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <span>to</span>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport('pdf')}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4" />
                      Excel
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const date = dayjs().startOf('month').startOf('week').add(i, 'day');
                  const isToday = date.isSame(dayjs(), 'day');
                  const hasCheckIn = Math.random() > 0.5;

                  return (
                    <div
                      key={i}
                      className={`aspect-square p-2 rounded-lg border ${
                        isToday ? 'border-blue-500' : 'border-gray-200'
                      } hover:bg-gray-50 cursor-pointer`}
                    >
                      <div className="text-right mb-2">
                        <span className="text-sm text-gray-900">
                          {date.format('D')}
                        </span>
                      </div>
                      {hasCheckIn && (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInHistory;