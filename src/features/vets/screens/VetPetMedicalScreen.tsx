
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
          <div className="flex items-center px-4 py-4 bg-gradient-to-r from-[#79D0B8] to-[#5FBFB3] shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 w-10 h-10" 
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white font-semibold text-lg ml-3">Expediente médico</h1>
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
          <div className="flex items-center px-4 py-4 bg-gradient-to-r from-[#79D0B8] to-[#5FBFB3] shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 w-10 h-10" 
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white font-semibold text-lg ml-3">Expediente médico</h1>
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
        <div className="flex items-center px-4 py-4 bg-gradient-to-r from-[#79D0B8] to-[#5FBFB3] shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 w-10 h-10" 
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="ml-3 flex-1 min-w-0">
            <h1 className="text-white font-semibold text-lg truncate">
              Expediente médico
            </h1>
            <p className="text-white/80 text-sm truncate">
              {petName}
            </p>
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="bg-gray-50 min-h-screen pb-20">
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
