
import React from 'react';
import { useParams } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

// Import hooks
import { useGroomingDetail } from '../hooks/useGroomingDetail';

// Import components
import GroomingDetailHeader from '../components/detail/GroomingDetailHeader';
import GroomingDetailContent from '../components/detail/GroomingDetailContent';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';

const GroomingDetailScreen = () => {
  const { id } = useParams();
  const { 
    data, 
    loading, 
    error, 
    handleBookAppointment, 
    handleReviewClick,
    handleSendMessage
  } = useGroomingDetail(id);

  // Create header component for all states
  const Header = () => (
    <GroomingDetailHeader title={loading ? "Cargando..." : error ? "Error" : "Perfil de Estética"} />
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
      <GroomingDetailContent
        data={data}
        onBookAppointment={handleBookAppointment}
        onReviewClick={handleReviewClick}
        onSendMessage={handleSendMessage}
      />
    </LayoutBase>
  );
};

export default GroomingDetailScreen;
