import React from 'react';
import { Search, Filter, Users, MapPin, DollarSign, Edit2, Trash2 } from 'lucide-react';
import GymListItem from './GymListItem';
import { Gym } from '../../types/gym';

interface GymListProps {
  gyms: Gym[];
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
  onEditGym: (gymId: string) => void;
  onDeleteGym: (gymId: string) => void;
}

const GymList: React.FC<GymListProps> = ({
  gyms,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onEditGym,
  onDeleteGym
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search gyms..."
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {gyms.map((gym) => (
          <GymListItem
            key={gym.id}
            gym={gym}
            onEdit={() => onEditGym(gym.id)}
            onDelete={() => onDeleteGym(gym.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GymList;