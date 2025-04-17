import React from 'react';

interface SkeletonLoaderProps {
  type?: 'user' | 'booking' | 'minimal';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'minimal' }) => {
  if (type === 'minimal') {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (type === 'user') {
    return (
      <div className="animate-pulse bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (type === 'booking') {
    return (
      <div className="animate-pulse bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;