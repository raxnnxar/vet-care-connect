
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Card } from '@/ui/molecules/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AppointmentsList } from '../components/AppointmentsList';
import { Button } from '@/ui/atoms/button';
import { useAuth } from '@/features/auth/hooks/useAuth';

const OwnerAppointmentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ['owner-appointments', activeTab, user?.id],
    queryFn: async () => {
      console.log('Fetching appointments for tab:', activeTab);
      
      try {
        console.log('Current user ID:', user?.id);
        
        // First get all appointments for this user without date filtering
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('owner_id', user?.id)
          .order('created_at', { ascending: false });

        if (appointmentsError) {
          console.error('Error fetching appointments:', appointmentsError);
          throw appointmentsError;
        }
        
        console.log('Fetched appointments:', appointmentsData);

        if (!appointmentsData || appointmentsData.length === 0) {
          return [];
        }

        // Filter appointments based on the current time and tab
        const now = new Date();
        const filteredAppointments = appointmentsData.filter(appointment => {
          if (!appointment.appointment_date) return false;
          
          try {
            let appointmentDate: Date;
            
            // Handle different appointment_date formats
            if (typeof appointment.appointment_date === 'string') {
              appointmentDate = new Date(appointment.appointment_date);
            } else if (typeof appointment.appointment_date === 'object' && appointment.appointment_date !== null) {
              // Handle JSON format like {date: "2024-01-01", time: "10:00"}
              const dateObj = appointment.appointment_date as any;
              if (dateObj.date && dateObj.time) {
                appointmentDate = new Date(`${dateObj.date}T${dateObj.time}`);
              } else {
                return false;
              }
            } else {
              return false;
            }
            
            // Filter based on tab
            if (activeTab === 'upcoming') {
              return appointmentDate >= now;
            } else {
              return appointmentDate < now;
            }
          } catch (error) {
            console.error('Error parsing appointment date:', error);
            return false;
          }
        });

        // Get pet IDs from filtered appointments
        const petIds = filteredAppointments
          .map(appointment => appointment.pet_id)
          .filter(petId => petId !== null);

        // Fetch pets data separately if we have pet IDs
        let petsData = [];
        if (petIds.length > 0) {
          const { data: pets, error: petsError } = await supabase
            .from('pets')
            .select('id, name, profile_picture_url')
            .in('id', petIds);

          if (petsError) {
            console.error('Error fetching pets:', petsError);
            // Don't throw error, just continue without pet data
          } else {
            petsData = pets || [];
          }
        }

        // Create a map of pet data for easy lookup
        const petsMap = new Map();
        petsData.forEach(pet => {
          petsMap.set(pet.id, pet);
        });
        
        // Transform the data to match the expected format
        return filteredAppointments.map(appointment => {
          const pet = petsMap.get(appointment.pet_id);
          
          return {
            ...appointment,
            // Ensure appointment_date is a string for consistency
            appointment_date: typeof appointment.appointment_date === 'string' 
              ? appointment.appointment_date 
              : JSON.stringify(appointment.appointment_date),
            // Extract pet name safely
            pet_name: pet?.name || 'Mascota sin nombre',
            // Add pet object for compatibility
            pets: pet ? {
              id: pet.id,
              name: pet.name,
              profile_picture_url: pet.profile_picture_url
            } : null,
            // Ensure status is properly set
            status: appointment.status || 'pendiente'
          };
        });
      } catch (error) {
        console.error('Error in fetchAppointments:', error);
        throw error;
      }
    },
    enabled: !!user?.id, // Only run query when user ID is available
  });

  const handleFindVets = () => {
    navigate('/owner/find-vets');
  };

  const goToAppointmentDetails = (id: string) => {
    navigate(`/owner/appointments/${id}`);
  };

  const handleRetry = () => {
    refetch();
  };

  if (error) {
    return (
      <LayoutBase
        header={
          <div className="px-4 py-3 bg-[#79D0B8]">
            <h1 className="text-white font-medium text-lg mb-2">Mis Citas</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="appointments" />}
      >
        <div className="p-4">
          <Card className="p-6 text-center">
            <p className="text-gray-500 mb-4">Ocurrió un error al cargar las citas</p>
            <Button 
              variant="default"
              onClick={handleRetry}
            >
              Reintentar
            </Button>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={
        <div className="px-4 py-3 bg-[#79D0B8]">
          <h1 className="text-white font-medium text-lg mb-2">Mis Citas</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4 pb-20">
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="past">Anteriores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <AppointmentsList
              appointments={appointments || []}
              isLoading={isLoading}
              onAppointmentClick={goToAppointmentDetails}
              onAddAppointment={handleFindVets}
              isUpcoming={true}
            />
          </TabsContent>
          
          <TabsContent value="past">
            <AppointmentsList
              appointments={appointments || []}
              isLoading={isLoading}
              onAppointmentClick={goToAppointmentDetails}
              onAddAppointment={handleFindVets}
              isUpcoming={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </LayoutBase>
  );
};

export default OwnerAppointmentsScreen;
