import React from 'react';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import dayjs from 'dayjs';

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

interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[];
}

const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({ withdrawals }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Withdrawal History</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {withdrawals.map((withdrawal) => (
          <div key={withdrawal.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    ₹{withdrawal.amount.toLocaleString()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    getStatusColor(withdrawal.status)
                  }`}>
                    {withdrawal.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Bank: {withdrawal.accountDetails.bankName}</p>
                  <p>Account: {withdrawal.accountDetails.accountNumber}</p>
                  <p>IFSC: {withdrawal.accountDetails.ifscCode}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Requested: {dayjs(withdrawal.requestedAt).format('MMM D, HH:mm')}</span>
                </div>
                {withdrawal.processedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>Processed: {dayjs(withdrawal.processedAt).format('MMM D, HH:mm')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithdrawalHistory;