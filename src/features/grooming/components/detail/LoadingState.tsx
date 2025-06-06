
import React from 'react';
import { Skeleton } from '@/ui/atoms/skeleton';

const LoadingState: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-[#79D0B8] pt-20 pb-6 flex flex-col items-center text-white">
        <Skeleton className="w-24 h-24 rounded-full bg-white/20 mb-4" />
        <Skeleton className="h-8 w-48 bg-white/20 mb-2" />
        <Skeleton className="h-4 w-32 bg-white/20 mb-4" />
        <Skeleton className="h-10 w-40 bg-white/20 rounded-full" />
      </div>
      <div className="p-4 space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
};

export default LoadingState;
