import React, { useState } from 'react';
import { 
  Users, Crown, Briefcase, Check, CreditCard, Calendar,
  Download, FileText, TrendingUp, DollarSign, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Plan {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'family' | 'corporate';
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  maxBookings?: number;
  maxUsers?: number;
  peakHourAccess: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'wallet' | 'emi';
  name: string;
  icon: React.ReactNode;
}

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      type: 'basic',
      price: 1999,
      billingCycle: 'monthly',
      maxBookings: 30,
      peakHourAccess: false,
      features: [
        '30 slots per month',
        'Standard gym access',
        'Basic fitness tracking',
        'Email support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      type: 'premium',
      price: 3999,
      billingCycle: 'monthly',
      peakHourAccess: true,
      features: [
        'Unlimited slots',
        'Priority peak hour access',
        'Advanced fitness tracking',
        '24/7 support',
        'Personal trainer consultation'
      ]
    },
    {
      id: 'family',
      name: 'Family Plan',
      type: 'family',
      price: 5999,
      billingCycle: 'monthly',
      maxUsers: 4,
      peakHourAccess: true,
      features: [
        'Up to 4 family members',
        'Shared slot pool',
        'Family workout sessions',
        'Priority booking',
        'Dedicated support'
      ]
    },
    {
      id: 'corporate',
      name: 'Corporate Plan',
      type: 'corporate',
      price: 9999,
      billingCycle: 'monthly',
      maxUsers: 10,
      peakHourAccess: true,
      features: [
        'Custom user limit',
        'Bulk booking system',
        'Corporate wellness programs',
        'Analytics dashboard',
        'Account manager'
      ]
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: 'upi', type: 'upi', name: 'UPI', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'card', type: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'wallet', type: 'wallet', name: 'Digital Wallet', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'emi', type: 'emi', name: 'EMI', icon: <Calendar className="w-5 h-5" /> }
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Subscription Report', 20, 20);
    // Add more content to PDF
    doc.save('subscription-report.pdf');
    toast.success('PDF exported successfully');
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(plans);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plans');
    XLSX.writeFile(wb, 'subscription-plans.xlsx');
    toast.success('Excel exported successfully');
  };

  const getPlanIcon = (type: string) => {
    switch (type) {
      case 'basic':
        return <Users className="w-6 h-6 text-blue-500" />;
      case 'premium':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 'family':
        return <Users className="w-6 h-6 text-green-500" />;
      case 'corporate':
        return <Briefcase className="w-6 h-6 text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
              <p className="text-gray-600 mt-1">Manage and monitor subscription plans</p>
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
                <span className="text-sm text-gray-600">Active Subscriptions</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-green-600">₹4.2L</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Premium Users</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">456</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">Corporate Accounts</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">12</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 p-6 transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    {getPlanIcon(plan.type)}
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    ₹{plan.price}
                    <span className="text-sm text-gray-500">/{plan.billingCycle}</span>
                  </p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedPlan === plan.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Select Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        {selectedPlan && (
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  {method.icon}
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>

            {selectedPaymentMethod && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    toast.success('Payment processed successfully');
                    setSelectedPlan(null);
                    setSelectedPaymentMethod(null);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;