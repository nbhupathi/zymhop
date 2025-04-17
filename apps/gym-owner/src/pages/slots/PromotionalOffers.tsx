import React, { useState } from 'react';
import { Calendar, Tag, Percent, Clock, Users, Trash2, Plus, Edit2 } from 'lucide-react';
import dayjs from 'dayjs';

interface Promotion {
  id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  applicableSlots: string[];
  minBookings: number;
  maxUsage: number;
  currentUsage: number;
  status: 'active' | 'scheduled' | 'expired';
}

const PromotionalOffers = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      name: 'Early Bird Special',
      discountType: 'percentage',
      discountValue: 20,
      startDate: '2025-03-01',
      endDate: '2025-03-31',
      applicableSlots: ['06:00', '07:00', '08:00'],
      minBookings: 1,
      maxUsage: 100,
      currentUsage: 45,
      status: 'active'
    },
    {
      id: '2',
      name: 'Afternoon Delight',
      discountType: 'fixed',
      discountValue: 200,
      startDate: '2025-03-15',
      endDate: '2025-04-15',
      applicableSlots: ['14:00', '15:00', '16:00'],
      minBookings: 2,
      maxUsage: 50,
      currentUsage: 10,
      status: 'scheduled'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (promotion: Promotion) => {
    return (promotion.currentUsage / promotion.maxUsage) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Promotional Offers</h1>
                <p className="text-gray-600 mt-1">Manage special discounts and promotions</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Promotion
              </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Active Promotions</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {promotions.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Scheduled</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {promotions.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">Total Usage</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {promotions.reduce((sum, p) => sum + p.currentUsage, 0)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Avg. Discount</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">25%</p>
              </div>
            </div>
          </div>

          {/* Promotions List */}
          <div className="p-6">
            <div className="space-y-4">
              {promotions.map(promotion => (
                <div
                  key={promotion.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {promotion.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(promotion.status)}`}>
                          {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {promotion.discountType === 'percentage' ? 
                          `${promotion.discountValue}% off` :
                          `₹${promotion.discountValue} off`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPromotion(promotion)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPromotions(promotions.filter(p => p.id !== promotion.id));
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {dayjs(promotion.startDate).format('MMM D')} - {dayjs(promotion.endDate).format('MMM D')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Applicable Slots</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {promotion.applicableSlots.length} slots
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Min. Bookings</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {promotion.minBookings}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Usage</p>
                      <div className="mt-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {promotion.currentUsage}/{promotion.maxUsage}
                          </span>
                          <span className="text-sm text-gray-500">
                            {Math.round(getUsagePercentage(promotion))}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${getUsagePercentage(promotion)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalOffers;