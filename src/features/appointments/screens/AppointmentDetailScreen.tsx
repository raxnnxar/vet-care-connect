
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';
import { AppointmentHeader } from '../components/AppointmentHeader';
import { PetInfo } from '../components/PetInfo';
import { ServiceDetails } from '../components/ServiceDetails';
import { useAppointments } from '../hooks/useAppointments';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Pet } from '@/features/pets/types';

interface AppointmentPetResponse {
  id: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  date_of_birth?: string;
  profile_picture_url?: string;
}

const AppointmentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { appointments } = useAppointments();

  const { data: appointmentDetails, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      if (!id) throw new Error('No appointment ID provided');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pets:pet_id(id, name, species, breed, sex, date_of_birth, profile_picture_url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching appointment:', error);
        toast.error('No se pudo cargar los detalles de la cita');
        throw error;
      }

      return data;
    },
    enabled: !!id
  });

  const goBack = () => navigate(-1);

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="appointments" />}
      >
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </LayoutBase>
    );
  }

  if (!appointmentDetails) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="appointments" />}
      >
        <div className="p-4">
          <p className="text-center text-gray-500">No se encontró la cita</p>
          <Button 
            className="w-full mt-4 bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={goBack}
          >
            Regresar
          </Button>
        </div>
      </LayoutBase>
    );
  }

  const appointmentTime = appointmentDetails.appointment_date 
    ? format(new Date(appointmentDetails.appointment_date), 'HH:mm')
    : '';

  // Transform pet data safely to a Pet object only when valid
  let pet: Pet | null = null;
  
  if (appointmentDetails.pets && 
      typeof appointmentDetails.pets === 'object' && 
      appointmentDetails.pets !== null &&
      !('error' in appointmentDetails.pets) &&
      'id' in appointmentDetails.pets) {
        
    // Now we know it's a valid pet object 
    const petData = appointmentDetails.pets as AppointmentPetResponse;
    
    pet = {
      id: petData.id,
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      sex: petData.sex,
      date_of_birth: petData.date_of_birth,
      profile_picture_url: petData.profile_picture_url,
      owner_id: appointmentDetails.owner_id || '',
      created_at: ''
    };
  }

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4 space-y-6 pb-20">
        <AppointmentHeader
          date={appointmentDetails.appointment_date}
          time={appointmentTime}
          status={appointmentDetails.status}
        />
        
        {pet && (
          <PetInfo pet={pet} />
        )}

        <ServiceDetails
          serviceType={appointmentDetails.service_type}
          duration={appointmentDetails.duration}
          price={appointmentDetails.price}
          clinicName={appointmentDetails.location || ""}
          clinicAddress={appointmentDetails.location || ""}
          notes={appointmentDetails.notes}
          paymentStatus={appointmentDetails.payment_status}
        />
      </div>
    </LayoutBase>
  );
};

export default AppointmentDetailScreen;
