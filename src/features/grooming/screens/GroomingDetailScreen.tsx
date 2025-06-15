
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useGroomingDetail } from '../hooks/useGroomingDetail';
import GroomingDetailContent from '../components/detail/GroomingDetailContent';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';

const GroomingDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { data, loading, error } = useGroomingDetail(id || '');

  if (loading) {
    return (
      <LayoutBase
        footer={<NavbarInferior activeTab="home" />}
      >
        <LoadingState />
      </LayoutBase>
    );
  }

  if (error || !data) {
    return (
      <LayoutBase
        footer={<NavbarInferior activeTab="home" />}
      >
        <ErrorState message={error || 'No se encontró la estética'} onGoBack={() => navigate('/owner/estetica')} />
      </LayoutBase>
    );
  }

  const handleBookAppointment = () => {
    // Navigate to booking screen with grooming ID
    navigate(`/book-appointment?groomingId=${id}&type=grooming`);
  };

  const handleReviewClick = () => {
    if (!user?.id) {
      // Handle not logged in case
      navigate('/login');
      return;
    }
    navigate(`/grooming/${id}/review`);
  };

  const handleSendMessage = () => {
    if (!user?.id) {
      // Handle not logged in case
      navigate('/login');
      return;
    }
    navigate(`/chats?providerId=${id}&providerType=grooming`);
  };

  const handleGoBack = () => {
    navigate('/owner/estetica');
  };

  return (
    <LayoutBase
      footer={<NavbarInferior activeTab="home" />}
    >
      <GroomingDetailContent
        data={data}
        onBookAppointment={handleBookAppointment}
        onReviewClick={handleReviewClick}
        onSendMessage={handleSendMessage}
        onGoBack={handleGoBack}
      />
    </LayoutBase>
  );
};

export default GroomingDetailScreen;
