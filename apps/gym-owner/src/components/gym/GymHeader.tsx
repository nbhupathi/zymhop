import React from 'react';
import { Building2, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

interface GymHeaderProps {
  totalGyms: number;
  activeGyms: number;
  pendingGyms: number;
  rejectedGyms: number;
  onAddGym: () => void;
}

const GymHeader: React.FC<GymHeaderProps> = ({
  totalGyms,
  activeGyms,
  pendingGyms,
  rejectedGyms,
  onAddGym
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gym Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your registered gyms</p>
        </div>
        <button
          onClick={onAddGym}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add New Gym
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">Total Gyms</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{totalGyms}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Active Gyms</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{activeGyms}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-gray-600">Pending Approval</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pendingGyms}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-600">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{rejectedGyms}</p>
        </div>
      </div>
    </div>
  );
};

export default GymHeader;