
import React from 'react';

const GroomingProfileLoading: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        {/* Hero section skeleton */}
        <div className="h-48 bg-gradient-to-r from-[#79D0B8] to-[#5FBFB3] relative">
          <div className="absolute bottom-4 left-4 flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-white/20 rounded w-32"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
            </div>
          </div>
        </div>
        
        {/* Content sections skeleton */}
        <div className="p-4 space-y-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroomingProfileLoading;
