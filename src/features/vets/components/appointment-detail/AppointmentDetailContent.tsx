
import React from 'react';
import AppointmentInfoCard from './AppointmentInfoCard';
import PetInfoCard from './PetInfoCard';
import MedicalHistoryCard from './MedicalHistoryCard';
import OwnerInfoCard from './OwnerInfoCard';
import ClinicalNoteCard from './ClinicalNoteCard';
import AppointmentActionButtons from './AppointmentActionButtons';
import { getStatusBadge } from '@/features/vets/utils/appointmentUtils';

interface AppointmentDetailContentProps {
  appointment: any;
  medicalHistory: any;
  user: any;
  onViewFullHistory: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSendMessage: () => void;
  getAppointmentDateString: (appointmentDate: any) => string;
}

const AppointmentDetailContent: React.FC<AppointmentDetailContentProps> = ({
  appointment,
  medicalHistory,
  user,
  onViewFullHistory,
  onApprove,
  onReject,
  onSendMessage,
  getAppointmentDateString
}) => {
  return (
    <div className="p-4 space-y-6 pb-20">
      <AppointmentInfoCard 
        appointment={appointment}
        getStatusBadge={getStatusBadge}
      />
      
      <PetInfoCard pet={appointment.pets} />
      
      <MedicalHistoryCard 
        medicalHistory={medicalHistory}
        onViewFullHistory={onViewFullHistory}
      />
      
      <OwnerInfoCard ownerInfo={appointment.pet_owners} />
      
      {appointment.pets?.id && user?.id && (
        <ClinicalNoteCard
          appointmentId={appointment.id}
          petId={appointment.pets.id}
          veterinarianId={user.id}
          appointmentDate={getAppointmentDateString(appointment.appointment_date)}
        />
      )}
      
      <AppointmentActionButtons
        appointmentStatus={appointment.status}
        onApprove={onApprove}
        onReject={onReject}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default AppointmentDetailContent;
