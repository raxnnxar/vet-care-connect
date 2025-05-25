
import React from 'react';
import { Card, CardContent } from '@/ui/molecules/card';

interface VeterinarianCardProps {
  veterinarian: any;
  isLoading: boolean;
  currentStep: number;
  children: React.ReactNode;
}

const VeterinarianCard: React.FC<VeterinarianCardProps> = ({ 
  veterinarian, 
  isLoading, 
  currentStep, 
  children 
}) => {
  const getVetName = () => {
    if (!veterinarian) return '';
    
    const displayName = veterinarian.service_providers?.profiles?.display_name 
      || veterinarian.service_providers?.business_name 
      || '';
      
    const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
    return displayName ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}` : '';
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {!isLoading && currentStep !== 3 && (
          <h2 className="text-lg font-medium mb-1">{getVetName()}</h2>
        )}
        {isLoading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-pulse w-full">
              <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

export default VeterinarianCard;
