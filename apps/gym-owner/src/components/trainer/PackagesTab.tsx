import React, { useState } from 'react';
import { DollarSign, Users, Clock, Tag, Edit2, Trash2, Plus } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  type: 'one-on-one' | 'group' | 'specialized';
  price: number;
  duration: number;
  sessionsPerWeek: number;
  totalSessions: number;
  description: string;
  features: string[];
  isActive: boolean;
}

interface PackagesTabProps {
  packages: Package[];
  onEditPackage: (pkg: Package) => void;
  onDeletePackage: (packageId: string) => void;
  onAddPackage: () => void;
}

const PackagesTab: React.FC<PackagesTabProps> = ({
  packages,
  onEditPackage,
  onDeletePackage,
  onAddPackage
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredPackages = packages.filter(pkg => 
    filter === 'all' ? true : 
    filter === 'active' ? pkg.isActive : !pkg.isActive
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {['all', 'active', 'inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === status
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={onAddPackage}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-lg border ${
              pkg.isActive ? 'border-blue-200' : 'border-gray-200'
            } p-6`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium text-gray-900">{pkg.name}</h3>
                <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                  pkg.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditPackage(pkg)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeletePackage(pkg.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{pkg.price}
                </span>
                <span className="text-sm text-gray-500">per month</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {pkg.type === 'one-on-one' ? '1-on-1 Training' :
                     pkg.type === 'group' ? 'Group Training' : 'Specialized Training'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {pkg.sessionsPerWeek} sessions per week
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {pkg.duration} minutes per session
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600">{pkg.description}</p>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackagesTab;