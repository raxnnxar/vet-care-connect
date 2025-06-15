
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { Star, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { useNavigate } from 'react-router-dom';

// Import existing sections
import GroomingProfileHero from './GroomingProfileHero';
import GroomingAnimalsSection from './GroomingAnimalsSection';
import GroomingServicesSection from './GroomingServicesSection';
import GroomingLocationSection from './GroomingLocationSection';
import GroomingReviewsSection from './GroomingReviewsSection';

export interface GroomingDetailData {
  id: string;
  business_name: string;
  profile_image_url?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  animals_accepted: string[];
  services_offered: any[];
  availability: Record<string, any>;
  // Add rating data when available
  average_rating?: number;
  total_reviews?: number;
}

interface GroomingDetailContentProps {
  data: GroomingDetailData;
  onBookAppointment: () => void;
  onReviewClick: () => void;
  onSendMessage: () => void;
}

const GroomingDetailContent: React.FC<GroomingDetailContentProps> = ({
  data,
  onBookAppointment,
  onReviewClick,
  onSendMessage
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero section with green background and back button */}
        <div className="relative">
          {/* Back button positioned absolutely */}
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <GroomingProfileHero 
            businessName={data.business_name}
            profileImageUrl={data.profile_image_url}
            averageRating={data.average_rating || 0}
            totalReviews={data.total_reviews || 0}
            getInitials={getInitials}
            onRatingClick={onReviewClick}
            groomingId={data.id}
          />
        </div>

        {/* Content sections with padding */}
        <div className="p-4 space-y-6">
          {/* Animals accepted section */}
          <GroomingAnimalsSection animals={data.animals_accepted} />

          {/* Services section */}
          <GroomingServicesSection services={data.services_offered} />

          {/* Location section - only show if location data exists */}
          {data.location && data.latitude && data.longitude && (
            <GroomingLocationSection 
              location={data.location}
              latitude={data.latitude}
              longitude={data.longitude}
            />
          )}

          {/* Reviews section */}
          <GroomingReviewsSection 
            groomingId={data.id}
            averageRating={data.average_rating}
            totalReviews={data.total_reviews}
          />
        </div>

        {/* Bottom spacing for fixed footer */}
        <div className="pb-32" />
      </div>

      {/* Fixed action buttons footer */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-200 z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-3">
            <Button
              onClick={onBookAppointment}
              className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Agendar cita
            </Button>
            
            <div className="flex gap-3">
              <Button
                onClick={onSendMessage}
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Enviar mensaje
              </Button>
              
              <Button
                onClick={onReviewClick}
                variant="outline"
                className="flex-1"
              >
                <Star className="h-4 w-4 mr-2" />
                Dejar reseña
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroomingDetailContent;
