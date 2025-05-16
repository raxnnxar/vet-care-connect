
import React from 'react';
import { useParams } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

// Import hooks
import { useVetDetail } from '../hooks/useVetDetail';

// Import components
import VetDetailHeader from '../components/detail/VetDetailHeader';
import VetDetailContent from '../components/detail/VetDetailContent';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';

const VetDetailScreen = () => {
  const { id } = useParams();
  const { 
    data, 
    loading, 
    error, 
    handleBookAppointment, 
    handleReviewClick 
  } = useVetDetail(id);

  // Create header component for all states
  const Header = () => (
    <VetDetailHeader title={loading ? "Cargando..." : error ? "Error" : "Perfil del Veterinario"} />
  );

  if (loading) {
    return (
      <LayoutBase
        header={<Header />}
        footer={<NavbarInferior activeTab="home" />}
      >
        <LoadingState />
      </LayoutBase>
    );
  }

  if (error || !data) {
    return (
      <LayoutBase
        header={<Header />}
        footer={<NavbarInferior activeTab="home" />}
      >
        <ErrorState message={error} onGoBack={() => window.history.back()} />
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={null}
      footer={<NavbarInferior activeTab="home" />}
    >
      <VetDetailContent
        data={data}
        onBookAppointment={handleBookAppointment}
        onReviewClick={handleReviewClick}
      />
    </LayoutBase>
  );
};

export default VetDetailScreen;
