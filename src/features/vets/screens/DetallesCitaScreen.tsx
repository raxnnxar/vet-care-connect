import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/ui/molecules/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MedicalInfoViewer from '@/features/pets/components/medical/MedicalInfoViewer';
import RejectAppointmentModal from '@/features/vets/components/RejectAppointmentModal';
import { useSelector } from 'react-redux';
import { useAppointmentActions } from '@/features/vets/hooks/useAppointmentActions';
import { getStatusBadge } from '@/features/vets/utils/appointmentUtils';
import AppointmentInfoCard from '@/features/vets/components/appointment-detail/AppointmentInfoCard';
import PetInfoCard from '@/features/vets/components/appointment-detail/PetInfoCard';
import MedicalHistoryCard from '@/features/vets/components/appointment-detail/MedicalHistoryCard';
import OwnerInfoCard from '@/features/vets/components/appointment-detail/OwnerInfoCard';
import AppointmentActionButtons from '@/features/vets/components/appointment-detail/AppointmentActionButtons';
import ClinicalNoteCard from '@/features/vets/components/appointment-detail/ClinicalNoteCard';

const DetallesCitaScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showFullMedicalHistory, setShowFullMedicalHistory] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  
  const { handleApproveAppointment, handleRejectSuccess, handleSendMessage } = useAppointmentActions(id);
  
  const { data: appointmentDetails, isLoading, error } = useQuery({
    queryKey: ['appointment-details', id],
    queryFn: async () => {
      if (!id) throw new Error('No appointment ID provided');
      
      // Fetch appointment with related data
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          pets!appointments_pet_id_fkey (
            id,
            name,
            species,
            breed,
            date_of_birth,
            weight,
            sex,
            temperament,
            profile_picture_url,
            owner_id,
            created_at
          ),
          pet_owners!appointments_owner_id_fkey (
            address,
            phone_number
          )
        `)
        .eq('id', id)
        .single();
      
      if (appointmentError) {
        console.error('Error fetching appointment:', appointmentError);
        throw appointmentError;
      }
      
      // Fetch medical history if pet exists
      let medicalHistory = null;
      if (appointment.pets?.id) {
        const { data: medical, error: medicalError } = await supabase
          .from('pet_medical_history')
          .select('*')
          .eq('pet_id', appointment.pets.id)
          .maybeSingle();
        
        if (!medicalError) {
          medicalHistory = medical;
        }
      }
      
      return {
        appointment,
        medicalHistory
      };
    },
    enabled: !!id
  });
  
  const goBack = () => navigate(-1);

  const handleViewMedicalHistory = () => {
    if (appointmentDetails?.appointment?.pets?.id) {
      setShowFullMedicalHistory(true);
    }
  };

  const handleSendMessageClick = () => {
    if (appointmentDetails?.appointment?.owner_id) {
      handleSendMessage(appointmentDetails.appointment.owner_id);
    }
  };
  
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
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </LayoutBase>
    );
  }
  
  if (error || !appointmentDetails) {
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
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="p-4 text-center">
          <p className="text-gray-500 mb-3">No se encontraron detalles para esta cita</p>
          <Button 
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={goBack}
          >
            Volver
          </Button>
        </div>
      </LayoutBase>
    );
  }
  
  const { appointment, medicalHistory } = appointmentDetails;
  
  // Show full medical history modal
  if (showFullMedicalHistory && appointment.pets) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowFullMedicalHistory(false)}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">
              Historial Médico - {appointment.pets.name}
            </h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <ScrollArea className="h-[calc(100vh-140px)]">
          <MedicalInfoViewer pet={appointment.pets} />
        </ScrollArea>
      </LayoutBase>
    );
  }
  
  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">
            Detalles de Cita - {appointment.pets?.name || 'Mascota'}
          </h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 space-y-6 pb-20">
        <AppointmentInfoCard 
          appointment={appointment}
          getStatusBadge={getStatusBadge}
        />
        
        <PetInfoCard pet={appointment.pets} />
        
        <MedicalHistoryCard 
          medicalHistory={medicalHistory}
          onViewFullHistory={handleViewMedicalHistory}
        />
        
        <OwnerInfoCard ownerInfo={appointment.pet_owners} />
        
        {/* New Clinical Note Section */}
        {appointment.pets?.id && user?.id && (
          <ClinicalNoteCard
            appointmentId={appointment.id}
            petId={appointment.pets.id}
            veterinarianId={user.id}
            appointmentDate={appointment.appointment_date}
          />
        )}
        
        <AppointmentActionButtons
          appointmentStatus={appointment.status}
          onApprove={handleApproveAppointment}
          onReject={() => setShowRejectModal(true)}
          onSendMessage={handleSendMessageClick}
        />
      </div>

      {/* Reject Modal */}
      {appointmentDetails && (
        <RejectAppointmentModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          appointmentId={id!}
          ownerId={appointmentDetails.appointment.owner_id}
          vetId={user?.id || ''}
          petName={appointmentDetails.appointment.pets?.name || 'la mascota'}
          onSuccess={handleRejectSuccess}
        />
      )}
    </LayoutBase>
  );
};

export default DetallesCitaScreen;
