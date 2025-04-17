import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  selectedPeriod: 'all' | 'week' | 'month';
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  selectedPeriod
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'credit'
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}>
                {transaction.type === 'credit' ? (
                  <ArrowUpRight className={`w-5 h-5 ${
                    transaction.type === 'credit'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`} />
                ) : (
                  <ArrowDownRight className={`w-5 h-5 ${
                    transaction.type === 'credit'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`} />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  Ref: {transaction.reference || 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${
                transaction.type === 'credit'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}
                ₹{transaction.amount.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  getStatusColor(transaction.status)
                }`}>
                  {transaction.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  {dayjs(transaction.date).format('MMM D, HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;