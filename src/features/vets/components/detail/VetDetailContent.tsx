
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

  console.log('VetDetailContent - Complete data object:', data);
  console.log('VetDetailContent - Location data:', {
    clinic_address: data.clinicAddress,
    clinic_latitude: data.clinicLatitude,
    clinic_longitude: data.clinicLongitude
  });

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
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          className="bg-white/20 text-white rounded-full p-2" 
          onClick={handleGoBack}
        >
          <ArrowLeft size={24} />
        </Button>
      </div>
      
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
        <div className="mb-4">
          <VetAnimalsTreatedSection animals={data.animalsTreated || []} />
        </div>
        
        <div className="mb-4">
          <VetAboutSection bio={data.bio} />
        </div>
        
        <div className="mb-4">
          <VetServicesSection services={Array.isArray(data.servicesOffered) ? data.servicesOffered : []} />
        </div>
        
        <div className="mb-4">
          <VetEducationSection education={data.education || []} />
        </div>
        
        <div className="mb-4">
          <VetCertificationsSection certifications={data.certifications || []} />
        </div>
        
        <div className="mb-6">
          <VetLocationSection 
            address={data.clinicAddress}
            latitude={data.clinicLatitude}
            longitude={data.clinicLongitude}
          />
        </div>
        
        <VetActionButtons 
          onBookAppointment={onBookAppointment}
          onSendMessage={onSendMessage}
        />

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
