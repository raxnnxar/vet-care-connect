
import React from 'react';
import { Skeleton } from '@/ui/atoms/skeleton';
import { Card, CardContent } from '@/ui/molecules/card';

interface VeterinarianCardProps {
  veterinarian: any;
  isLoading: boolean;
  currentStep: number;
  children: React.ReactNode;
  providerType?: 'vet' | 'grooming' | null;
}

const VeterinarianCard: React.FC<VeterinarianCardProps> = ({ 
  veterinarian, 
  isLoading, 
  currentStep, 
  children,
  providerType 
}) => {
  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getProviderName = () => {
    if (providerType === 'grooming') {
      return veterinarian?.business_name || 'Estética';
    }
    return veterinarian?.service_providers?.business_name || 
           veterinarian?.service_providers?.profiles?.display_name || 
           'Veterinario';
  };

  const getProviderType = () => {
    return providerType === 'grooming' ? 'Estética' : 'Veterinario';
  };

  return (
    <div className="space-y-6">
      {/* Step content */}
      <Card>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default VeterinarianCard;
