
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import GroomingProfileHero from './GroomingProfileHero';
import GroomingAboutSection from './GroomingAboutSection';
import GroomingActionButtons from './GroomingActionButtons';
import GroomingServicesSection from './GroomingServicesSection';
import GroomingAnimalsSection from './GroomingAnimalsSection';
import { getInitials } from '@/features/vets/utils/vetDetailUtils';

interface GroomingDetailContentProps {
  data: any;
  onBookAppointment: () => void;
  onReviewClick: () => void;
  onSendMessage: () => void;
}

const GroomingDetailContent: React.FC<GroomingDetailContentProps> = ({
  data,
  onBookAppointment,
  onReviewClick,
  onSendMessage,
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Back button that floats on top of the header */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          className="bg-white/20 text-white rounded-full p-2" 
          onClick={handleGoBack}
        >
          <ArrowLeft size={24} />
        </Button>
      </div>
      
      {/* Hero Section */}
      <GroomingProfileHero 
        businessName={data.business_name || 'Estética'}
        profileImageUrl={data.profile_image_url}
        averageRating={0} // TODO: Add rating functionality
        totalReviews={0}  // TODO: Add reviews functionality
        getInitials={getInitials}
        onRatingClick={onReviewClick}
        groomingId={data.id}
      />
      
      <div className="p-4 pb-28 bg-gray-50">
        {/* Animals Accepted Section */}
        <div className="mb-4">
          <GroomingAnimalsSection animals={data.animals_accepted || []} />
        </div>
        
        {/* Services Section */}
        <div className="mb-4">
          <GroomingServicesSection services={Array.isArray(data.services_offered) ? data.services_offered : []} />
        </div>
        
        {/* About Section */}
        <div className="mb-6">
          <GroomingAboutSection location={data.location} />
        </div>
        
        {/* Action Buttons */}
        <GroomingActionButtons 
          onBookAppointment={onBookAppointment}
          onSendMessage={onSendMessage}
        />
      </div>
    </>
  );
};

export default GroomingDetailContent;
