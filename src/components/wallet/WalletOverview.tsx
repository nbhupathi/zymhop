import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Clock } from 'lucide-react';

interface WalletOverviewProps {
  balance: number;
  pendingAmount: number;
  totalEarnings: number;
  onWithdraw: () => void;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({
  balance,
  pendingAmount,
  totalEarnings,
  onWithdraw
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Wallet Balance</h2>
            <p className="text-sm text-gray-500">Updated just now</p>
          </div>
        </div>
        <button
          onClick={onWithdraw}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Withdraw Funds
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Available Balance</span>
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{balance.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Amount</span>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{pendingAmount.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Earnings</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;