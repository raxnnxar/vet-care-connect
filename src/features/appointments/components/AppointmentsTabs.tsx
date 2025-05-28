
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { AppointmentsList } from './AppointmentsList';

interface AppointmentsTabsProps {
  appointments: any[];
  isLoading: boolean;
  onAppointmentClick: (id: string) => void;
  onAddAppointment: () => void;
  onTabChange: (value: string) => void;
}

export const AppointmentsTabs: React.FC<AppointmentsTabsProps> = ({
  appointments,
  isLoading,
  onAppointmentClick,
  onAddAppointment,
  onTabChange
}) => {
  return (
    <Tabs defaultValue="upcoming" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="upcoming">Próximas</TabsTrigger>
        <TabsTrigger value="past">Anteriores</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming">
        <AppointmentsList
          appointments={appointments || []}
          isLoading={isLoading}
          onAppointmentClick={onAppointmentClick}
          onAddAppointment={onAddAppointment}
          isUpcoming={true}
        />
      </TabsContent>
      
      <TabsContent value="past">
        <AppointmentsList
          appointments={appointments || []}
          isLoading={isLoading}
          onAppointmentClick={onAppointmentClick}
          onAddAppointment={onAddAppointment}
          isUpcoming={false}
        />
      </TabsContent>
    </Tabs>
  );
};
