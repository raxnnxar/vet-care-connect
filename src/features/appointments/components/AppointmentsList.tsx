
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentSkeleton } from './AppointmentSkeleton';

interface AppointmentsListProps {
  appointments: any[];
  isLoading: boolean;
  onAppointmentClick: (id: string) => void;
  onAddAppointment: () => void;
  isUpcoming?: boolean;
}

export const AppointmentsList = ({
  appointments,
  isLoading,
  onAppointmentClick,
  onAddAppointment,
  isUpcoming = true
}: AppointmentsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <AppointmentSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (appointments?.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500 mb-4">
          {isUpcoming ? 'No tienes citas programadas' : 'No tienes citas anteriores'}
        </p>
        {isUpcoming && (
          <Button 
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={onAddAppointment}
          >
            Buscar Veterinarios
          </Button>
        )}
      </Card>
    );
  }

  return (
    <>
      {appointments?.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onClick={onAppointmentClick}
        />
      ))}
      
      {isUpcoming && (
        <Button 
          className="w-full mt-2 bg-[#79D0B8] hover:bg-[#5FBFB3]"
          onClick={onAddAppointment}
        >
          Agendar Nueva Cita
        </Button>
      )}
    </>
  );
};
