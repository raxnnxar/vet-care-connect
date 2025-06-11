
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import VetProfileHero from './VetProfileHero';
import VetAboutSection from './VetAboutSection';
import VetContactSection from './VetContactSection';
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

  // Format veterinarian name using display_name from profiles
  const displayName = data.service_providers?.profiles?.display_name || data.service_providers?.business_name || '';
  
  const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
  const vetName = displayName 
    ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`.trim()
    : `Dr. ${data.id.substring(0, 5)}`;
  
  const specializations = Array.isArray(data.specialization) && data.specialization.length > 0
    ? data.specialization.map((spec: string) => translateSpecialization(spec)).join(', ')
    : 'Medicina General';
    
  function translateSpecialization(spec: string): string {
    const translations: Record<string, string> = {
      'cardiology': 'Cardiología',
      'dermatology': 'Dermatología',
      'orthopedics': 'Ortopedia',
      'neurology': 'Neurología',
      'ophthalmology': 'Oftalmología',
      'oncology': 'Oncología',
      'general': 'Medicina General',
      'surgery': 'Cirugía',
      'dentistry': 'Odontología',
      'nutrition': 'Nutrición',
      'internal_medicine': 'Medicina Interna',
      'emergency': 'Emergencias',
      'rehabilitation': 'Rehabilitación',
      'exotics': 'Animales Exóticos',
    };
    
    return translations[spec.toLowerCase()] || spec;
  }

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
        profileImageUrl={data.profile_image_url}
        averageRating={data.average_rating}
        totalReviews={data.total_reviews}
        licenseNumber={data.license_number}
        getInitials={getInitials}
        onRatingClick={() => setReviewsDialogOpen(true)}
        vetId={data.id}
      />
      
      <div className="p-4 pb-28 bg-gray-50">
        {/* Animals Treated Section */}
        <div className="mb-4">
          <VetAnimalsTreatedSection animals={data.animals_treated || []} />
        </div>
        
        {/* About Section */}
        <div className="mb-4">
          <VetAboutSection bio={data.bio} />
        </div>
        
        {/* Services Section */}
        <div className="mb-4">
          <VetServicesSection services={Array.isArray(data.services_offered) ? data.services_offered : []} />
        </div>
        
        {/* Education Section */}
        <div className="mb-4">
          <VetEducationSection education={data.education || []} />
        </div>
        
        {/* Certifications Section */}
        <div className="mb-4">
          <VetCertificationsSection certifications={data.certifications || []} />
        </div>
        
        {/* Contact Section */}
        <div className="mb-6">
          <VetContactSection email={data.service_providers?.profiles?.email} />
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
