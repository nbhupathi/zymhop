import React, { useState } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, Clock, DollarSign,
  Download, FileText, Bell, Filter, Calendar, ChevronDown,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import WalletOverview from '../../components/wallet/WalletOverview';
import WithdrawalHistory from '../../components/wallet/WithdrawalHistory';
import TransactionList from '../../components/wallet/TransactionList';
import NotificationCenter from '../../components/wallet/NotificationCenter';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  accountDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

interface Notification {
  id: string;
  type: 'withdrawal' | 'deposit' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    type: 'view' | 'approve' | 'reject';
    label: string;
  };
}

const WalletDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'week' | 'month'>('month');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N1',
      type: 'withdrawal',
      message: 'Your withdrawal request of ₹5,000 has been approved',
      timestamp: dayjs().subtract(1, 'hour').toISOString(),
      read: false,
      action: {
        type: 'view',
        label: 'View Details'
      }
    },
    {
      id: 'N2',
      type: 'deposit',
      message: 'New payment received: ₹2,500 from John Doe',
      timestamp: dayjs().subtract(2, 'hours').toISOString(),
      read: false
    }
  ]);

  // Mock data
  const walletData = {
    balance: 25000,
    pendingAmount: 5000,
    totalEarnings: 150000,
    recentTransactions: [
      {
        id: 'T1',
        type: 'credit',
        amount: 2500,
        description: 'Payment from John Doe',
        date: dayjs().subtract(1, 'day').toISOString(),
        status: 'completed',
        reference: 'PAY123456'
      },
      {
        id: 'T2',
        type: 'debit',
        amount: 5000,
        description: 'Withdrawal to Bank Account',
        date: dayjs().subtract(2, 'days').toISOString(),
        status: 'pending',
        reference: 'WTH123456'
      }
    ] as Transaction[],
    withdrawals: [
      {
        id: 'W1',
        amount: 5000,
        status: 'pending',
        requestedAt: dayjs().subtract(1, 'day').toISOString(),
        accountDetails: {
          bankName: 'HDFC Bank',
          accountNumber: 'XXXX1234',
          ifscCode: 'HDFC0001234'
        }
      },
      {
        id: 'W2',
        amount: 10000,
        status: 'approved',
        requestedAt: dayjs().subtract(5, 'days').toISOString(),
        processedAt: dayjs().subtract(4, 'days').toISOString(),
        accountDetails: {
          bankName: 'ICICI Bank',
          accountNumber: 'XXXX5678',
          ifscCode: 'ICIC0005678'
        }
      }
    ] as Withdrawal[]
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Exporting transactions as ${format.toUpperCase()}`);
  };

  const handleNotificationAction = (notification: Notification) => {
    switch (notification.action?.type) {
      case 'view':
        // Handle view action
        break;
      case 'approve':
        toast.success('Request approved successfully');
        break;
      case 'reject':
        toast.error('Request rejected');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
          <p className="text-gray-600 mt-1">Manage your earnings and withdrawals</p>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-8 space-y-8">
            {/* Wallet Overview */}
            <WalletOverview
              balance={walletData.balance}
              pendingAmount={walletData.pendingAmount}
              totalEarnings={walletData.totalEarnings}
              onWithdraw={handleWithdraw}
            />

            {/* Transactions Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="all">All Time</option>
                    </select>
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
              </div>

              <TransactionList
                transactions={walletData.recentTransactions}
                selectedPeriod={selectedPeriod}
              />
            </div>

            {/* Withdrawal History */}
            <WithdrawalHistory withdrawals={walletData.withdrawals} />
          </div>

          {/* Notifications Sidebar */}
          <div className="col-span-4">
            <NotificationCenter
              notifications={notifications}
              onAction={handleNotificationAction}
              onMarkAsRead={(id) => {
                setNotifications(notifications.map(n =>
                  n.id === id ? { ...n, read: true } : n
                ));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;