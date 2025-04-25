
import { Card } from '@/ui/molecules/card';

export const AppointmentSkeleton = () => (
  <Card className="p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </Card>
);
