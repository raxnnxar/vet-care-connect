
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import VetProfileHero from './VetProfileHero';
import VetAboutSection from './VetAboutSection';
import VetLocationSection from './VetLocationSection';
import VetActionButtons from './VetActionButtons';
import VetEducationSection from './VetEducationSection';
import VetCertificationsSection from './VetCertificationsSection';
import VetServicesSection from './VetServicesSection';
import VetAnimalsTreatedSection from './VetAnimalsTreatedSection';
import { getInitials } from '../../utils/vetDetailUtils';
import { ReviewsDialog } from '../../utils/vetReviewUtils';

interface VetDetailContentProps {
  data: any;
  onBookAppointment: () => void;
  onReviewClick: () => void;
  onSendMessage: () => void;
}

const VetDetailContent: React.FC<VetDetailContentProps> = ({
  data,
  onBookAppointment,
  onReviewClick,
  onSendMessage,
}) => {
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Debug: Log the complete data object to see what we're receiving
  console.log('VetDetailContent - Complete data object:', data);
  console.log('VetDetailContent - Location data:', {
    clinic_address: data.clinicAddress,
    clinic_latitude: data.clinicLatitude,
    clinic_longitude: data.clinicLongitude
  });

  // Use the displayName directly from the formatted data
  const displayName = data.displayName || '';
  
  const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
  const vetName = displayName 
    ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`.trim()
    : `Dr. ${data.id.substring(0, 5)}`;
  
  const specializations = data.specializations || 'Medicina General';

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
      
      {/* Hero Section with clickable rating */}
      <VetProfileHero 
        displayName={vetName}
        specializations={specializations}
        profileImageUrl={data.profileImageUrl}
        averageRating={data.averageRating}
        totalReviews={data.totalReviews}
        licenseNumber={data.licenseNumber}
        getInitials={getInitials}
        onRatingClick={() => setReviewsDialogOpen(true)}
        vetId={data.id}
      />
      
      <div className="p-4 pb-28 bg-gray-50">
        {/* Animals Treated Section */}
        <div className="mb-4">
          <VetAnimalsTreatedSection animals={data.animalsTreated || []} />
        </div>
        
        {/* About Section */}
        <div className="mb-4">
          <VetAboutSection bio={data.bio} />
        </div>
        
        {/* Services Section */}
        <div className="mb-4">
          <VetServicesSection services={Array.isArray(data.servicesOffered) ? data.servicesOffered : []} />
        </div>
        
        {/* Education Section */}
        <div className="mb-4">
          <VetEducationSection education={data.education || []} />
        </div>
        
        {/* Certifications Section */}
        <div className="mb-4">
          <VetCertificationsSection certifications={data.certifications || []} />
        </div>
        
        {/* Location Section */}
        <div className="mb-6">
          <VetLocationSection 
            address={data.clinicAddress}
            latitude={data.clinicLatitude}
            longitude={data.clinicLongitude}
          />
        </div>
        
        {/* Action Buttons */}
        <VetActionButtons 
          onBookAppointment={onBookAppointment}
          onSendMessage={onSendMessage}
        />

        {/* Reviews Dialog */}
        <ReviewsDialog
          isOpen={reviewsDialogOpen}
          setIsOpen={setReviewsDialogOpen}
          veterinarianId={data.id}
          onReviewClick={onReviewClick}
        />
      </div>
    </>
  );
};

export default VetDetailContent;
