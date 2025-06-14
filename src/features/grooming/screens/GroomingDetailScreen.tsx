
import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useGroomingDetail } from '../hooks/useGroomingDetail';
import GroomingDetailContent from '../components/detail/GroomingDetailContent';
import LoadingState from '../components/detail/LoadingState';
import ErrorState from '../components/detail/ErrorState';

const GroomingDetailScreen = () => {
  const { groomingId } = useParams<{ groomingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedPetId = searchParams.get('petId') || undefined;
  
  console.log('GroomingDetailScreen - groomingId:', groomingId);
  console.log('GroomingDetailScreen - selectedPetId:', selectedPetId);
  
  const { data, loading, error, handleBookAppointment, handleReviewClick, handleSendMessage } = useGroomingDetail(groomingId!);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !data) {
    console.error('Error in GroomingDetailScreen:', error);
    return <ErrorState message={error || "No se pudo cargar la información de la estética"} onGoBack={handleGoBack} />;
  }

  console.log('GroomingDetailScreen - data loaded successfully:', data);

  return (
    <GroomingDetailContent
      data={data}
      onBookAppointment={handleBookAppointment}
      onReviewClick={handleReviewClick}
      onSendMessage={handleSendMessage}
      selectedPetId={selectedPetId}
    />
  );
};

export default GroomingDetailScreen;
