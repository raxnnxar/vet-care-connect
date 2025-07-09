
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useOwnerAppointments } from '../hooks/useOwnerAppointments';
import { AppointmentsHeader } from '../components/AppointmentsHeader';
import { AppointmentsErrorState } from '../components/AppointmentsErrorState';
import { AppointmentsTabs } from '../components/AppointmentsTabs';

const OwnerAppointmentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  const { data: appointments, isLoading, error, refetch } = useOwnerAppointments(activeTab);

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
    return <AppointmentsErrorState onRetry={handleRetry} />;
  }

  return (
    <LayoutBase
      header={<AppointmentsHeader />}
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="mobile-container mobile-padding pb-20">
        <AppointmentsTabs
          appointments={appointments || []}
          isLoading={isLoading}
          onAppointmentClick={goToAppointmentDetails}
          onAddAppointment={handleFindVets}
          onTabChange={setActiveTab}
        />
      </div>
    </LayoutBase>
  );
};

export default OwnerAppointmentsScreen;
