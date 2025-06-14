
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGroomingDetail } from '../hooks/useGroomingDetail';
import GroomingDetailContent from '../components/detail/GroomingDetailContent';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';

const GroomingDetailScreen = () => {
  const { groomingId } = useParams<{ groomingId: string }>();
  const [searchParams] = useSearchParams();
  const selectedPetId = searchParams.get('petId') || undefined;
  
  const { grooming, loading, error } = useGroomingDetail(groomingId!);

  const handleBookAppointment = () => {
    console.log('Book appointment with grooming:', groomingId);
    // TODO: Navigate to appointment booking screen
  };

  const handleReviewClick = () => {
    console.log('Open reviews for grooming:', groomingId);
    // TODO: Navigate to reviews screen
  };

  const handleSendMessage = () => {
    console.log('Send message to grooming:', groomingId);
    // TODO: Navigate to chat screen
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !grooming) {
    return <ErrorState message={error || "No se pudo cargar la información de la estética"} />;
  }

  return (
    <GroomingDetailContent
      data={grooming}
      onBookAppointment={handleBookAppointment}
      onReviewClick={handleReviewClick}
      onSendMessage={handleSendMessage}
      selectedPetId={selectedPetId}
    />
  );
};

export default GroomingDetailScreen;
