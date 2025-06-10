
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { Star, MessageCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { useNavigate } from 'react-router-dom';

// Import existing sections
import GroomingProfileHero from './GroomingProfileHero';
import GroomingAboutSection from './GroomingAboutSection';
import GroomingAnimalsSection from './GroomingAnimalsSection';
import GroomingServicesSection from './GroomingServicesSection';
import GroomingLocationSection from './GroomingLocationSection';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Perfil de Estética</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Hero section */}
        <GroomingProfileHero 
          userId={data.id}
          profileData={data}
          averageRating={data.average_rating || 0}
          totalReviews={data.total_reviews || 0}
        />

        {/* About section */}
        <GroomingAboutSection businessName={data.business_name} />

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

        {/* Action buttons */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
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

      {/* Bottom spacing for navigation */}
      <div className="pb-24" />
    </div>
  );
};

export default GroomingDetailContent;
