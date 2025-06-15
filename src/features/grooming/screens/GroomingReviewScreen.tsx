
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { useGroomingDetail } from '../hooks/useGroomingDetail';
import { useGroomingReviewForm } from '../hooks/useGroomingReviewForm';
import ReviewForm from '@/features/vets/components/reviews/ReviewForm';
import GroomingProfileCard from '../components/reviews/GroomingProfileCard';

const GroomingReviewScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: groomingData, loading: groomingLoading } = useGroomingDetail(id);
  const {
    rating,
    setRating,
    comment,
    setComment,
    existingReview,
    loading: reviewLoading,
    submitting,
    submitReview
  } = useGroomingReviewForm(id || '');

  const handleGoBack = () => {
    navigate(-1);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (groomingLoading || reviewLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center bg-[#79D0B8] px-4 py-3">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-white hover:bg-white/20 p-2 mr-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-white font-medium text-lg">Cargando...</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#79D0B8]"></div>
        </div>
      </LayoutBase>
    );
  }

  if (!groomingData) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center bg-[#79D0B8] px-4 py-3">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-white hover:bg-white/20 p-2 mr-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-white font-medium text-lg">Error</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No se pudo cargar la información de la estética</p>
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={
        <div className="flex items-center bg-[#79D0B8] px-4 py-3">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="text-white hover:bg-white/20 p-2 mr-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-white font-medium text-lg">
            {existingReview ? 'Editar reseña' : 'Dejar reseña'}
          </h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 space-y-6">
        <GroomingProfileCard
          businessName={groomingData.business_name}
          profileImage={groomingData.profile_image_url || null}
          getInitials={getInitials}
        />

        <ReviewForm
          initialRating={rating}
          initialComment={comment}
          onRatingChange={setRating}
          onCommentChange={setComment}
          onSubmit={submitReview}
          isSubmitting={submitting}
          isEditing={!!existingReview}
        />
      </div>
    </LayoutBase>
  );
};

export default GroomingReviewScreen;
