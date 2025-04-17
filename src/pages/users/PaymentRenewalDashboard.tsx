import React, { useState } from 'react';
import { 
  Calendar, DollarSign, TrendingUp, Users, Bell, 
  ChevronDown, ChevronUp, AlertCircle, CreditCard,
  Download, FileText, Filter, Wallet, RefreshCw
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  lastReminder?: string;
}

interface RenewalStats {
  totalDue: number;
  pendingRenewals: number;
  overduePayments: number;
  upcomingRenewals: number;
}

const PaymentRenewalDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'pending' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: dayjs().format('YYYY-MM-DD'),
    end: dayjs().add(30, 'days').format('YYYY-MM-DD'),
  });

  // Generate mock payment data
  const payments: Payment[] = Array.from({ length: 20 }, (_, i) => ({
    id: `P${i + 1}`,
    userId: `U${i + 1}`,
    userName: `User ${i + 1}`,
    amount: 2999 + (i * 100),
    dueDate: dayjs().add(i % 30, 'days').format('YYYY-MM-DD'),
    status: ['paid', 'pending', 'overdue'][i % 3] as 'paid' | 'pending' | 'overdue',
    paymentMethod: ['Credit Card', 'UPI', 'Net Banking'][i % 3],
    lastReminder: i % 2 === 0 ? dayjs().subtract(2, 'days').format('YYYY-MM-DD') : undefined,
  }));

  const stats: RenewalStats = {
    totalDue: payments.reduce((sum, p) => sum + (p.status !== 'paid' ? p.amount : 0), 0),
    pendingRenewals: payments.filter(p => p.status === 'pending').length,
    overduePayments: payments.filter(p => p.status === 'overdue').length,
    upcomingRenewals: payments.filter(p => 
      dayjs(p.dueDate).isBetween(dayjs(), dayjs().add(7, 'days'))
    ).length,
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Payment Renewal Report', 20, 20);
    doc.text(`Total Due: ₹${stats.totalDue}`, 20, 30);
    doc.text(`Pending Renewals: ${stats.pendingRenewals}`, 20, 40);
    doc.save('payment-renewals.pdf');
    toast.success('PDF exported successfully');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(payments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, 'payment-renewals.xlsx');
    toast.success('Excel exported successfully');
  };

  const handleSendReminder = (payment: Payment) => {
    toast.success(`Payment reminder sent to ${payment.userName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (selectedPeriod !== 'all' && payment.status !== selectedPeriod) return false;
    if (searchQuery && !payment.userName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return dayjs(payment.dueDate).isBetween(dateRange.start, dateRange.end, 'day', '[]');
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment & Renewal Management</h1>
              <p className="text-gray-600 mt-1">Track and manage membership payments and renewals</p>
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
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Total Due</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">₹{stats.totalDue}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Pending Renewals</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingRenewals}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-gray-600">Overdue Payments</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.overduePayments}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Upcoming This Week</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.upcomingRenewals}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
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
          </div>

          {/* Status Tabs */}
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'all'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Payments
            </button>
            <button
              onClick={() => setSelectedPeriod('pending')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'pending'
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setSelectedPeriod('overdue')}
              className={`px-4 py-2 rounded-lg ${
                selectedPeriod === 'overdue'
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Overdue
            </button>
          </div>
        </div>

        {/* Payments List */}
        <div className="divide-y divide-gray-200">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{payment.userName}</h3>
                    <p className="text-sm text-gray-500">Due: {dayjs(payment.dueDate ).format('MMM D, YYYY')}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-medium text-gray-900">₹{payment.amount}</p>
                  <button
                    onClick={() => handleSendReminder(payment)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Send Reminder
                  </button>
                  <button
                    onClick={() => setExpandedPayment(expandedPayment === payment.id ? null : payment.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    {expandedPayment === payment.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {expandedPayment === payment.id && (
                <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <div className="flex items-center gap-2 mt-1">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{payment.paymentMethod}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Reminder</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Bell className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {payment.lastReminder ? dayjs(payment.lastReminder).format('MMM D, YYYY') : 'No reminders sent'}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-end gap-2 mt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Process Payment
                      </button>
                      <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPayments.length === 0 && (
            <div className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No payments found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentRenewalDashboard;