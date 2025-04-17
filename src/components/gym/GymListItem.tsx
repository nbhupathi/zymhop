import React from 'react';
import { Users, MapPin, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { Gym } from '../../types/gym';

interface GymListItemProps {
  gym: Gym;
  onEdit: () => void;
  onDelete: () => void;
}

const GymListItem: React.FC<GymListItemProps> = ({ gym, onEdit, onDelete }) => {
  return (
    <div className="p-6">
      <div className="flex items-start gap-4">
        <img
          src={gym.logo}
          alt={gym.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{gym.name}</h3>
              <p className="text-sm text-gray-500">{gym.id}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              gym.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : gym.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {gym.status.toUpperCase()}
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{gym.ownerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{gym.city}, {gym.state}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">₹{gym.pricing.peak} - ₹{gym.pricing.nonPeak}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymListItem;