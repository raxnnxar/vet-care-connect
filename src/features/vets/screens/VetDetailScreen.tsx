
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useNavigate, useParams } from 'react-router-dom';
import { useVetDetails } from '../hooks/useVetDetails';

// Import our components
import VetDetailHeader from '../components/detail/VetDetailHeader';
import VetDetailsContent from '../components/detail/VetDetailsContent';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';

const VetDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useVetDetails(id);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBookAppointment = () => {
    navigate(`/owner/appointments/book/${id}`);
  };

  const handleReviewClick = () => {
    navigate(`/owner/vets/${id}/review`);
  };

  return (
    <LayoutBase
      header={
        <VetDetailHeader 
          title={loading ? "Cargando..." : error ? "Error" : "Perfil del Veterinario"} 
          onGoBack={handleGoBack} 
        />
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      {loading ? (
        <LoadingState />
      ) : error || !data ? (
        <ErrorState message={error} onGoBack={handleGoBack} />
      ) : (
        <VetDetailsContent 
          data={data} 
          onBookAppointment={handleBookAppointment}
          onReviewClick={handleReviewClick}
        />
      )}
    </LayoutBase>
  );
};

export default VetDetailScreen;
