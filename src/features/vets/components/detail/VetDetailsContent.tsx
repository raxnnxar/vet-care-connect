
import React from 'react';
import VetProfileHeader from './VetProfileHeader';
import VetAboutSection from './VetAboutSection';
import VetContactSection from './VetContactSection';
import VetEducationSection from './VetEducationSection';
import VetCertificationsSection from './VetCertificationsSection';
import VetServicesSection from './VetServicesSection';
import VetAnimalsTreatedSection from './VetAnimalsTreatedSection';
import VetActionButtons from './VetActionButtons';
import { getInitials, translateSpecialization } from '../../utils/vetDetailUtils';

interface VetDetailsContentProps {
  data: any;
  onBookAppointment: () => void;
  onReviewClick: () => void;
}

const VetDetailsContent: React.FC<VetDetailsContentProps> = ({ 
  data, 
  onBookAppointment, 
  onReviewClick 
}) => {
  // Format veterinarian name using display_name from profiles
  const displayName = data.service_providers?.profiles?.display_name || data.service_providers?.business_name || '';
  
  // For gendered prefix (Dr/Dra), we'll check if the name seems feminine (ends with 'a')
  const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
  const vetName = displayName 
    ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`.trim()
    : `Dr. ${data.id.substring(0, 5)}`;
  
  // Extract specializations and format them
  const specializations = Array.isArray(data.specialization) && data.specialization.length > 0
    ? data.specialization.map((spec: string) => translateSpecialization(spec)).join(', ')
    : 'Medicina General';
  
  return (
    <div className="p-4 pb-20 bg-gray-50">
      {/* Profile Header Card */}
      <div className="mb-4">
        <VetProfileHeader 
          data={data} 
          displayName={vetName}
          specializations={specializations}
          getInitials={getInitials} 
        />
      </div>
      
      {/* Animals Treated Section */}
      <div className="mb-4">
        <VetAnimalsTreatedSection animals={data.animals_treated || []} />
      </div>
      
      {/* About Section */}
      <div className="mb-4">
        <VetAboutSection bio={data.bio} />
      </div>
      
      {/* Education Section */}
      <div className="mb-4">
        <VetEducationSection education={data.education || []} />
      </div>
      
      {/* Certifications Section */}
      <div className="mb-4">
        <VetCertificationsSection certifications={data.certifications || []} />
      </div>
      
      {/* Services Section */}
      <div className="mb-4">
        <VetServicesSection services={Array.isArray(data.services_offered) ? data.services_offered : []} />
      </div>
      
      {/* Contact Section */}
      <div className="mb-6">
        <VetContactSection email={data.service_providers?.profiles?.email} />
      </div>
      
      {/* Action Buttons */}
      <VetActionButtons 
        onBookAppointment={onBookAppointment}
        onReviewClick={onReviewClick}
      />
    </div>
  );
};

export default VetDetailsContent;
