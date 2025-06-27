
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';
import MedicalRecordTabs from '@/components/medical/MedicalRecordTabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

const VetPetMedicalScreen: React.FC = () => {
  const { id: appointmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch appointment data to get pet and owner info
  const { data: appointmentData, isLoading } = useQuery({
    queryKey: ['appointment-for-medical', appointmentId],
    queryFn: async () => {
      if (!appointmentId) throw new Error('No appointment ID provided');
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          pet_id,
          owner_id,
          pets!appointments_pet_id_fkey (
            id,
            name,
            species,
            breed
          )
        `)
        .eq('id', appointmentId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!appointmentId
  });

  const handleBack = () => {
    navigate(`/vet/detalles-cita/${appointmentId}`);
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Expediente médico</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </LayoutBase>
    );
  }

  if (!appointmentData || !appointmentData.pet_id || !appointmentData.owner_id) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Expediente médico</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4">
          <p className="text-center text-gray-500">No se encontró información de la cita</p>
        </div>
      </LayoutBase>
    );
  }

  const petName = appointmentData.pets?.name || 'Mascota';

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">
            Expediente médico - {petName}
          </h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="pb-20">
        <MedicalRecordTabs
          petId={appointmentData.pet_id}
          petOwnerId={appointmentData.owner_id}
          showHeader={true}
        />
      </div>
    </LayoutBase>
  );
};

export default VetPetMedicalScreen;
