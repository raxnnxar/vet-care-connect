
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useSelector } from 'react-redux';
import { useAppointmentActions } from '@/features/vets/hooks/useAppointmentActions';
import { useAppointmentDetailData } from '@/features/vets/hooks/useAppointmentDetailData';
import { getAppointmentDateString } from '@/features/vets/utils/appointmentDateUtils';
import AppointmentDetailHeader from '@/features/vets/components/appointment-detail/AppointmentDetailHeader';
import AppointmentDetailLoading from '@/features/vets/components/appointment-detail/AppointmentDetailLoading';
import AppointmentDetailError from '@/features/vets/components/appointment-detail/AppointmentDetailError';
import AppointmentDetailContent from '@/features/vets/components/appointment-detail/AppointmentDetailContent';
import RejectAppointmentModal from '@/features/vets/components/RejectAppointmentModal';

const DetallesCitaScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  
  const { handleApproveAppointment, handleRejectSuccess, handleSendMessage } = useAppointmentActions(id);
  const { data: appointmentDetails, isLoading, error } = useAppointmentDetailData(id);
  
  const goBack = () => navigate(-1);

  // Placeholder function - no longer used
  const handleViewMedicalHistory = () => {
    // This function is kept for compatibility but does nothing
    console.log('Medical history view removed - using new tables');
  };

  const handleSendMessageClick = () => {
    if (appointmentDetails?.appointment?.owner_id) {
      handleSendMessage(appointmentDetails.appointment.owner_id);
    }
  };

  const handleRejectOrCancel = () => {
    setShowRejectModal(true);
  };
  
  if (isLoading) {
    return <AppointmentDetailLoading onBack={goBack} />;
  }
  
  if (error || !appointmentDetails) {
    return <AppointmentDetailError onBack={goBack} />;
  }
  
  const { appointment, medicalHistory } = appointmentDetails;
  
  return (
    <LayoutBase
      header={
        <AppointmentDetailHeader
          onBack={goBack}
          petName={appointment.pets?.name}
        />
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <AppointmentDetailContent
        appointment={appointment}
        medicalHistory={medicalHistory}
        user={user}
        onViewFullHistory={handleViewMedicalHistory}
        onApprove={handleApproveAppointment}
        onReject={handleRejectOrCancel}
        onSendMessage={handleSendMessageClick}
        getAppointmentDateString={getAppointmentDateString}
      />

      {/* Reject/Cancel Modal */}
      {appointmentDetails && (
        <RejectAppointmentModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          appointmentId={id!}
          ownerId={appointmentDetails.appointment.owner_id}
          vetId={user?.id || ''}
          petName={appointmentDetails.appointment.pets?.name || 'la mascota'}
          onSuccess={handleRejectSuccess}
          isConfirmedAppointment={appointment.status === 'programada'}
        />
      )}
    </LayoutBase>
  );
};

export default DetallesCitaScreen;
