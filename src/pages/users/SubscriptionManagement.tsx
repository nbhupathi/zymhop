import React, { useState } from 'react';
import { 
  Search, CheckCircle, Clock, Calendar, X, ChevronDown, ChevronUp,
  AlertCircle, DollarSign, Loader2, RefreshCw, QrCode, Download,
  FileText, TrendingUp, Users, Bell, Send, Filter, CreditCard,
  BarChart, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  planType: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  gym: string;
  status: 'active' | 'expired' | 'pending_renewal';
  verificationStatus: 'verified' | 'unverified';
  verifiedAt?: string;
  renewalDate: string;
  checkIns: {
    date: string;
    time: string;
    gym: string;
    verified: boolean;
  }[];
  paymentHistory: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
  }[];
  engagement: {
    totalVisits: number;
    avgVisitsPerWeek: number;
    lastVisit: string;
  };
}

interface QRModalProps {
  subscription: Subscription;
  onClose: () => void;
}

// Generate mock data
const generateMockData = (): Subscription[] => {
  const statuses = ['active', 'expired', 'pending_renewal'] as const;
  const planTypes = ['monthly', 'quarterly', 'yearly'] as const;
  const gyms = ['Downtown Fitness', 'Uptown Gym', 'Central Sports'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `S${i + 1}`,
    userId: `U${i + 1}`,
    userName: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `123-456-${(7890 + i).toString().padStart(4, '0')}`,
    planType: planTypes[i % planTypes.length],
    startDate: dayjs().subtract(i % 6, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().add(i % 3, 'month').format('YYYY-MM-DD'),
    gym: gyms[i % gyms.length],
    status: statuses[i % statuses.length],
    verificationStatus: i % 3 === 0 ? 'unverified' : 'verified',
    verifiedAt: i % 3 === 0 ? undefined : dayjs().subtract(i, 'days').format(),
    renewalDate: dayjs().add(i % 30, 'days').format('YYYY-MM-DD'),
    checkIns: Array.from({ length: 5 }, (_, j) => ({
      date: dayjs().subtract(j, 'days').format('YYYY-MM-DD'),
      time: `${(8 + j).toString().padStart(2, '0')}:00`,
      gym: gyms[j % gyms.length],
      verified: j % 2 === 0
    })),
    paymentHistory: Array.from({ length: 3 }, (_, j) => ({
      id: `P${i}${j}`,
      date: dayjs().subtract(j, 'months').format('YYYY-MM-DD'),
      amount: 2999 + (j * 100),
      status: ['paid', 'pending', 'failed'][j % 3] as 'paid' | 'pending' | 'failed'
    })),
    engagement: {
      totalVisits: 20 + i,
      avgVisitsPerWeek: 3 + (i % 3),
      lastVisit: dayjs().subtract(i % 7, 'days').format('YYYY-MM-DD')
    }
  }));
};

const QRModal: React.FC<QRModalProps> = ({ subscription, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [qrValue, setQrValue] = useState('');

  React.useEffect(() => {
    // Generate QR code value
    const qrData = {
      subscriptionId: subscription.id,
      userId: subscription.userId,
      validUntil: dayjs().add(5, 'minutes').toISOString(),
    };
    setQrValue(JSON.stringify(qrData));

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Regenerate QR code
          const newQrData = {
            ...qrData,
            validUntil: dayjs().add(5, 'minutes').toISOString(),
          };
          setQrValue(JSON.stringify(newQrData));
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [subscription]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-code-${subscription.id}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Verification QR Code</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="font-medium text-gray-900">{subscription.userName}</p>
          <p className="text-sm text-gray-600">{subscription.planType} Plan</p>
          <p className="text-xs text-gray-500 mt-1">Scan this code to verify your membership</p>
        </div>

        <div className="bg-white p-4 rounded-lg flex justify-center">
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Code refreshes in: <span className="font-medium">{formatTime(timeLeft)}</span>
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'upcoming' | 'today'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGym, setSelectedGym] = useState('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Subscription;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Generate mock data
  const subscriptions = generateMockData();

  const gyms = ['All Locations', 'Downtown Fitness', 'Uptown Gym', 'Central Sports'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending_renewal':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'unverified':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Subscription Report', 20, 20);
    // Add more content to PDF
    doc.save('subscription-report.pdf');
    toast.success('PDF exported successfully');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(subscriptions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Subscriptions');
    XLSX.writeFile(wb, 'subscriptions.xlsx');
    toast.success('Excel exported successfully');
  };

  const handleSendReminder = (subscription: Subscription) => {
    toast.success(`Reminder sent to ${subscription.userName}`);
  };

  const handleShowQRCode = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowQRModal(true);
  };

  const handleSort = (key: keyof Subscription) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const filteredSubscriptions = subscriptions
    .filter(sub => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          sub.userName.toLowerCase().includes(searchLower) ||
          sub.email.toLowerCase().includes(searchLower) ||
          sub.phone.includes(searchQuery)
        );
      }
      return true;
    })
    .filter(sub => {
      if (selectedGym !== 'all') {
        return sub.gym.toLowerCase() === selectedGym;
      }
      return true;
    })
    .filter(sub => {
      switch (activeTab) {
        case 'pending':
          return sub.status === 'pending_renewal';
        case 'upcoming':
          return dayjs(sub.renewalDate).isBefore(dayjs().add(7, 'days'));
        case 'today':
          return dayjs(sub.renewalDate).isSame(dayjs(), 'day');
        default:
          return true;
      }
    });

  // Sort subscriptions if sort config is set
  if (sortConfig) {
    filteredSubscriptions.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Calculate statistics
  const stats = {
    totalActive: subscriptions.filter(s => s.status === 'active').length,
    pendingRenewals: subscriptions.filter(s => s.status === 'pending_renewal').length,
    unverified: subscriptions.filter(s => s.verificationStatus === 'unverified').length,
    todayRenewals: subscriptions.filter(s => dayjs(s.renewalDate).isSame(dayjs(), 'day')).length
  };

  // Generate chart data
  const chartData = [
    { name: 'Active', value: stats.totalActive },
    { name: 'Pending Renewal', value: stats.pendingRenewals },
    { name: 'Unverified', value: stats.unverified },
    { name: "Today's Renewals", value: stats.todayRenewals }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
              <p className="text-gray-600 mt-1">Track and manage member subscriptions</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Active Members</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.totalActive}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Pending Renewals</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingRenewals}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">Unverified Users</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.unverified}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Today's Renewals</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.todayRenewals}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mt-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <select
              value={selectedGym}
              onChange={(e) => setSelectedGym(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {gyms.map((gym) => (
                <option key={gym} value={gym.toLowerCase().replace(' ', '-')}>
                  {gym}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'all'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              All Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'pending'
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Pending Renewals
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'upcoming'
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Upcoming This Week
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'today'
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Due Today
            </button>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="divide-y divide-gray-200">
          {filteredSubscriptions.map((subscription) => (
            <div key={subscription.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {subscription.userName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getStatusColor(subscription.verificationStatus)
                      }`}>
                        {subscription.verificationStatus.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getStatusColor(subscription.status)
                      }`}>
                        {subscription.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {subscription.verificationStatus === 'unverified' && (
                        <button
                          onClick={() => handleShowQRCode(subscription)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"
                        >
                          <QrCode className="w-4 h-4" />
                          Verify Now
                        </button>
                      )}
                      <button
                        onClick={() => handleSendReminder(subscription)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Send className="w-4 h-4" />
                        Remind
                      </button>
                      <button
                        onClick={() => setExpandedUser(expandedUser === subscription.id ? null : subscription.id)}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        {expandedUser === subscription.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Plan Type</p>
                      <p className="font-medium text-gray-900">
                        {subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Renewal Date</p>
                      <p className="font-medium text-gray-900">
                        {dayjs(subscription.renewalDate).format('MMM D, YYYY')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gym</p>
                      <p className="font-medium text-gray-900">{subscription.gym}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Check-in</p>
                      <p className="font-medium text-gray-900">
                        {dayjs(subscription.engagement.lastVisit).format('MMM D, YYYY')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {expandedUser === subscription.id && (
                <div className="mt-6 grid grid-cols-2 gap-6">
                  {/* Check-in History */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Recent Check-ins</h4>
                    <div className="space-y-3">
                      {subscription.checkIns.map((checkIn, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900">
                              {dayjs(checkIn.date).format('MMM D, YYYY')}
                            </span>
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-900">{checkIn.time}</span>
                          </div>
                          {checkIn.verified ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment History */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Payment History</h4>
                    <div className="space-y-3">
                      {subscription.paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              ₹{payment.amount}
                            </p>
                            <p className="text-xs text-gray-600">
                              {dayjs(payment.date).format('MMM D, YYYY')}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getStatusColor(payment.status)
                          }`}>
                            {payment.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="col-span-2">
                    <h4 className="font-medium text-gray-900 mb-4">Engagement Metrics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Visits</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {subscription.engagement.totalVisits}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Avg. Weekly Visits</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {subscription.engagement.avgVisitsPerWeek}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Last Visit</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {dayjs(subscription.engagement.lastVisit).format('MMM D')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredSubscriptions.length === 0 && (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No subscriptions found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedSubscription && (
        <QRModal
          subscription={selectedSubscription}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;