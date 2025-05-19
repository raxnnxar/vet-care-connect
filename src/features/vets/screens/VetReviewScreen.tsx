
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useVetReviewForm } from '../hooks/useVetReviewForm';
import { getInitials } from '../utils/reviewUtils';
import VetReviewHeader from '../components/reviews/VetReviewHeader';
import VetProfileCard from '../components/reviews/VetProfileCard';
import ReviewForm from '../components/reviews/ReviewForm';

const VetReviewScreen = () => {
  const { vetDetails, submitting, handleGoBack, handleSubmitReview } = useVetReviewForm();

  return (
    <LayoutBase
      header={<VetReviewHeader onBackClick={handleGoBack} />}
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20 flex flex-col gap-6">
        {/* Información del veterinario */}
        <VetProfileCard
          vetName={vetDetails.vetName}
          vetSpecialty={vetDetails.vetSpecialty}
          profileImage={vetDetails.profileImage}
          getInitials={getInitials}
        />
        
        {/* Formulario de reseña */}
        <ReviewForm
          onSubmit={handleSubmitReview}
          isSubmitting={submitting}
        />
      </div>
    </LayoutBase>
  );
};

export default VetReviewScreen;
