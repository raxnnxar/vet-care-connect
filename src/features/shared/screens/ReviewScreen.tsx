
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';
import { useReviewForm } from '../hooks/useReviewForm';
import ReviewForm from '@/features/vets/components/reviews/ReviewForm';
import VetProfileCard from '@/features/vets/components/reviews/VetProfileCard';

interface ReviewScreenProps {
  type: 'vet' | 'grooming';
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ type }) => {
  const {
    providerDetails,
    submitting,
    handleGoBack,
    handleSubmitReview
  } = useReviewForm(type);

  const getTitle = () => {
    return type === 'vet' ? 'Reseñar Veterinario' : 'Reseñar Estética';
  };

  const Header = () => (
    <div className="flex items-center p-4 bg-white border-b border-gray-200">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="flex items-center gap-2 mr-4"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-lg font-semibold">{getTitle()}</h1>
    </div>
  );

  return (
    <LayoutBase
      header={<Header />}
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
        <VetProfileCard
          vetName={providerDetails.providerName}
          vetSpecialty={providerDetails.providerType}
          profileImage={providerDetails.profileImage}
        />
        
        <ReviewForm
          onSubmit={handleSubmitReview}
          isSubmitting={submitting}
        />
      </div>
    </LayoutBase>
  );
};

export default ReviewScreen;
