
import React from 'react';
import { Separator } from '@/ui/atoms/separator';
import { GroomingProfile, ANIMAL_TYPES } from '@/features/auth/types/groomingTypes';
import { useGroomingProfileEditor } from '../../hooks/useGroomingProfileEditor';

// Import section components
import GroomingProfileHero from './sections/GroomingProfileHero';
import GroomingBusinessInfoSection from './sections/GroomingBusinessInfoSection';
import GroomingServicesSection from './sections/GroomingServicesSection';
import GroomingAnimalsSection from './sections/GroomingAnimalsSection';
import GroomingAvailabilitySection from './sections/GroomingAvailabilitySection';

interface GroomingProfilePreviewProps {
  profileData: GroomingProfile;
  userId: string;
  isLoading: boolean;
  onSaveSection: (sectionData: Partial<GroomingProfile>, sectionName: string) => Promise<void>;
}

const GroomingProfilePreview: React.FC<GroomingProfilePreviewProps> = ({ 
  profileData, 
  userId, 
  isLoading, 
  onSaveSection
}) => {
  const {
    editingSections,
    editedBusinessName,
    editedServices,
    editedAnimals,
    setEditedBusinessName,
    toggleEditSection,
    handleSaveBusinessInfo,
    handleSaveServices,
    handleSaveAnimals,
    handleSaveAvailability,
    addService,
    removeService,
    toggleAnimal
  } = useGroomingProfileEditor({
    profileData,
    onSaveSection
  });
  
  return (
    <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow overflow-hidden">
      {/* Hero section with profile image */}
      <GroomingProfileHero userId={userId} profileData={profileData} />
      
      {/* Content section */}
      <div className="p-4 space-y-6">
        {/* Información del negocio */}
        <GroomingBusinessInfoSection 
          businessName={profileData.business_name || ''}
          isEditing={editingSections.businessInfo}
          toggleEditing={() => toggleEditSection('businessInfo')}
          handleSave={handleSaveBusinessInfo}
          isLoading={isLoading}
          editedBusinessName={editedBusinessName}
          setEditedBusinessName={setEditedBusinessName}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* Servicios ofrecidos */}
        <GroomingServicesSection 
          services={profileData.services_offered || []}
          isEditing={editingSections.services}
          toggleEditing={() => toggleEditSection('services')}
          handleSave={handleSaveServices}
          isLoading={isLoading}
          editedServices={editedServices}
          addService={addService}
          removeService={removeService}
        />

        <Separator className="my-4 bg-gray-200" />

        {/* Animales que acepta */}
        <GroomingAnimalsSection 
          animals={profileData.animals_accepted || []}
          allAnimalTypes={Object.values(ANIMAL_TYPES)}
          isEditing={editingSections.animals}
          toggleEditing={() => toggleEditSection('animals')}
          handleSave={handleSaveAnimals}
          isLoading={isLoading}
          editedAnimals={editedAnimals}
          toggleAnimal={toggleAnimal}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* Disponibilidad */}
        <GroomingAvailabilitySection 
          availability={profileData.availability || {}}
          userId={userId}
          isEditing={editingSections.availability}
          toggleEditing={() => toggleEditSection('availability')}
          handleSave={handleSaveAvailability}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default GroomingProfilePreview;
