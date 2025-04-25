
import { Card } from '@/ui/molecules/card';

export const AppointmentSkeleton = () => (
  <Card className="p-4 mb-4 animate-pulse">
    <div className="flex justify-between items-start mb-2">
      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded-full w-16"></div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3 mt-3">
      <div className="flex">
        <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/5"></div>
      </div>
      <div className="flex">
        <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex">
        <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
      </div>
    </div>
  </Card>
);
