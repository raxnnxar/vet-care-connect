
import React from 'react';
import { Skeleton } from '@/ui/atoms/skeleton';

const ReviewsLoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((item) => (
        <div key={item} className="border-b pb-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="my-2">
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-16 w-full mt-2" />
        </div>
      ))}
    </div>
  );
};

export default ReviewsLoadingState;
