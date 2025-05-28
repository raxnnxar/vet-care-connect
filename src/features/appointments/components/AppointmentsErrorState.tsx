
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { AppointmentsHeader } from './AppointmentsHeader';

interface AppointmentsErrorStateProps {
  onRetry: () => void;
}

export const AppointmentsErrorState: React.FC<AppointmentsErrorStateProps> = ({ onRetry }) => {
  return (
    <LayoutBase
      header={<AppointmentsHeader />}
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4">
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">Ocurrió un error al cargar las citas</p>
          <Button 
            variant="default"
            onClick={onRetry}
          >
            Reintentar
          </Button>
        </Card>
      </div>
    </LayoutBase>
  );
};
