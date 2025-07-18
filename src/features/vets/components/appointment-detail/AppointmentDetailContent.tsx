
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { FileText } from 'lucide-react';
import AppointmentInfoCard from './AppointmentInfoCard';
import PetInfoCard from './PetInfoCard';
import OwnerInfoCard from './OwnerInfoCard';
import ClinicalNoteCard from './ClinicalNoteCard';
import TreatmentPlanCard from './TreatmentPlanCard';
import AppointmentActionButtons from './AppointmentActionButtons';
import MedicalPeekSection from '@/components/medical/MedicalPeekSection';
import { getStatusBadge } from '@/features/vets/utils/appointmentUtils';

interface AppointmentDetailContentProps {
  appointment: any;
  medicalHistory: any;
  user: any;
  onViewFullHistory: () => void;
  onApprove: () => void;
  onReject: () => void;
  onSendMessage: () => void;
  onMarkNoShow: () => void;
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
  onMarkNoShow,
  getAppointmentDateString
}) => {
  const navigate = useNavigate();

  const handleViewMedicalRecord = () => {
    navigate(`/vet/detalles-cita/${appointment.id}/expediente-medico`);
  };

  // Función para determinar si la hora de la cita ya pasó
  const isAppointmentTimePassed = () => {
    if (!appointment.appointment_date) return false;
    
    const appointmentDate = appointment.appointment_date;
    let dateTimeString = '';
    
    if (typeof appointmentDate === 'object' && appointmentDate.date && appointmentDate.time) {
      dateTimeString = `${appointmentDate.date}T${appointmentDate.time}:00`;
    } else if (typeof appointmentDate === 'string') {
      dateTimeString = appointmentDate;
    } else {
      return false;
    }
    
    const appointmentDateTime = new Date(dateTimeString);
    const now = new Date();
    
    return now > appointmentDateTime;
  };

  const timePassed = isAppointmentTimePassed();

  return (
    <div className="p-4 space-y-6 pb-20">
      <AppointmentInfoCard 
        appointment={appointment}
        getStatusBadge={getStatusBadge}
      />
      
      <PetInfoCard pet={appointment.pets} />
      
      {/* Peek section con información médica importante */}
      {appointment.pets?.id && (
        <MedicalPeekSection
          petId={appointment.pets.id}
          onViewFullMedical={handleViewMedicalRecord}
        />
      )}
      
      {/* Botón para ver expediente médico completo */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleViewMedicalRecord}
          className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
        >
          <FileText className="h-4 w-4 mr-2" />
          Ver expediente médico completo
        </Button>
      </div>
      
      <OwnerInfoCard ownerInfo={appointment.pet_owners} />
      
      {appointment.pets?.id && user?.id && (
        <ClinicalNoteCard
          appointmentId={appointment.id}
          petId={appointment.pets.id}
          veterinarianId={user.id}
          appointmentDate={getAppointmentDateString(appointment.appointment_date)}
        />
      )}
      
      {appointment.pets?.id && user?.id && (
        <TreatmentPlanCard
          appointmentId={appointment.id}
          petId={appointment.pets.id}
          veterinarianId={user.id}
        />
      )}
      
      <AppointmentActionButtons
        appointmentStatus={appointment.status}
        onApprove={onApprove}
        onReject={onReject}
        onSendMessage={onSendMessage}
      />

      {/* Action buttons container with better spacing and sizing */}
      <div className="space-y-4">
        {/* Botón de enviar mensaje - siempre visible */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="w-full max-w-sm h-12 border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
            onClick={onSendMessage}
          >
            Enviar mensaje
          </Button>
        </div>

        {/* Botón de cancelar cita para citas programadas - solo si no ha pasado la hora */}
        {appointment.status === 'programada' && !timePassed && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="w-full max-w-sm h-12 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={onReject}
            >
              Cancelar cita
            </Button>
          </div>
        )}

        {/* Botón de "No asistió" - solo si ya pasó la hora de la cita */}
        {(appointment.status === 'programada' || appointment.status === 'completada') && timePassed && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="w-full max-w-sm h-12 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              onClick={onMarkNoShow}
            >
              No asistió
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailContent;
