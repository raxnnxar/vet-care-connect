
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

  // Safely parse appointment date
  let appointmentDateString = '';
  let appointmentTime = '';
  
  if (appointmentDetails.appointment_date) {
    try {
      if (typeof appointmentDetails.appointment_date === 'string') {
        appointmentDateString = appointmentDetails.appointment_date;
        appointmentTime = format(new Date(appointmentDetails.appointment_date), 'HH:mm');
      } else if (typeof appointmentDetails.appointment_date === 'object' && appointmentDetails.appointment_date !== null) {
        // Handle case where appointment_date might be an object with date and time
        const dateObj = appointmentDetails.appointment_date as any;
        if (dateObj.date && dateObj.time) {
          appointmentDateString = `${dateObj.date}T${dateObj.time}`;
          appointmentTime = dateObj.time;
        }
      }
    } catch (error) {
      console.error('Error parsing appointment date:', error);
      appointmentDateString = 'Fecha no disponible';
      appointmentTime = 'Hora no disponible';
    }
  }

  // Transform pet data safely to a Pet object only when valid
  let pet: Pet | null = null;
  
  // Use null check before accessing properties
  if (appointmentDetails.pets && 
      typeof appointmentDetails.pets === 'object') {
    
    // Type assertion after validation
    const petsData = appointmentDetails.pets as AppointmentPetResponse;
    
    // Check if it's a valid pet object with required properties
    if ('id' in petsData && petsData.id) {
      pet = {
        id: petsData.id,
        name: petsData.name,
        species: petsData.species,
        breed: petsData.breed,
        sex: petsData.sex,
        date_of_birth: petsData.date_of_birth,
        profile_picture_url: petsData.profile_picture_url,
        owner_id: appointmentDetails.owner_id || '',
        created_at: ''
      };
    }
  }

  // Safely extract service type information
  let serviceType = '';
  let servicePrice: number | undefined;
  
  if (appointmentDetails.service_type) {
    try {
      if (typeof appointmentDetails.service_type === 'string') {
        serviceType = appointmentDetails.service_type;
      } else if (typeof appointmentDetails.service_type === 'object' && appointmentDetails.service_type !== null) {
        const serviceObj = appointmentDetails.service_type as any;
        serviceType = serviceObj.name || serviceObj.type || 'Servicio no especificado';
        servicePrice = serviceObj.price ? Number(serviceObj.price) : undefined;
      }
    } catch (error) {
      console.error('Error parsing service type:', error);
      serviceType = 'Servicio no especificado';
    }
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
          date={appointmentDateString}
          time={appointmentTime}
          status={appointmentDetails.status}
        />
        
        {pet && (
          <PetInfo pet={pet} />
        )}

        <ServiceDetails
          serviceType={serviceType}
          duration={appointmentDetails.duration}
          price={servicePrice}
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
