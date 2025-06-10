
import React from 'react';
import { Separator } from '@/ui/atoms/separator';
import { VeterinarianProfile, ANIMAL_TYPES, SPECIALIZATIONS } from '@/features/auth/types/veterinarianTypes';
import { useVetProfileEditor } from '../../hooks/useVetProfileEditor';

// Import section components
import ProfileHero from './sections/ProfileHero';
import AnimalsSection from './sections/AnimalsSection';
import SpecializationsSection from './sections/SpecializationsSection';
import PersonalInfoSection from './sections/PersonalInfoSection';
import ServicesSection from './sections/ServicesSection';
import AvailabilitySection from './sections/AvailabilitySection';
import EmergencyServiceSection from './sections/EmergencyServiceSection';
import EducationSection from './sections/EducationSection';
import CertificationsSection from './sections/CertificationsSection';
import LocationSection from './sections/LocationSection';

interface VetProfilePreviewProps {
  profileData: VeterinarianProfile;
  userId: string;
  isLoading: boolean;
  onSaveSection: (sectionData: Partial<VeterinarianProfile>, sectionName: string) => Promise<void>;
  onAvailabilityUpdated?: () => Promise<void>;
}

const VetProfilePreview: React.FC<VetProfilePreviewProps> = ({ 
  profileData, 
  userId, 
  isLoading, 
  onSaveSection,
  onAvailabilityUpdated
}) => {
  const {
    editingSections,
    editedBio,
    editedServices,
    editedAnimals,
    editedSpecializations,
    editedAddress,
    editedCoordinates,
    newService,
    setEditedBio,
    setEditedServices,
    setEditedAddress,
    setEditedCoordinates,
    setNewService,
    toggleEditSection,
    handleSaveBasicInfo,
    handleSaveServices,
    handleSaveAnimals,
    handleSaveSpecializations,
    handleSaveLocation,
    handleSaveEducation,
    handleSaveCertifications,
    handleSaveAvailability,
    addService,
    removeService,
    toggleAnimal,
    toggleSpecialization
  } = useVetProfileEditor({
    profileData,
    onSaveSection,
    onAvailabilityUpdated
  });
  
  return (
    <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow overflow-hidden">
      {/* Hero section with profile image */}
      <ProfileHero userId={userId} profileData={profileData} />
      
      {/* Content section */}
      <div className="p-4 space-y-6">
        {/* Animales que atiende */}
        <AnimalsSection 
          animals={profileData.animals_treated || []}
          allAnimalTypes={ANIMAL_TYPES}
          isEditing={editingSections.animals}
          toggleEditing={() => toggleEditSection('animals')}
          handleSave={handleSaveAnimals}
          isLoading={isLoading}
          editedAnimals={editedAnimals}
          toggleAnimal={toggleAnimal}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* SECCIÓN: Especialidades */}
        <SpecializationsSection 
          specializations={profileData.specializations || []}
          allSpecializations={SPECIALIZATIONS}
          isEditing={editingSections.specializations}
          toggleEditing={() => toggleEditSection('specializations')}
          handleSave={handleSaveSpecializations}
          isLoading={isLoading}
          editedSpecializations={editedSpecializations}
          toggleSpecialization={toggleSpecialization}
        />

        <Separator className="my-4 bg-gray-200" />

        {/* SECCIÓN: Educación */}
        <EducationSection 
          educationEntries={profileData.education}
          isEditing={editingSections.education}
          toggleEditing={() => toggleEditSection('education')}
          handleSave={handleSaveEducation}
          isLoading={isLoading}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* SECCIÓN: Certificaciones */}
        <CertificationsSection 
          certifications={profileData.certifications}
          isEditing={editingSections.certifications}
          toggleEditing={() => toggleEditSection('certifications')}
          handleSave={handleSaveCertifications}
          isLoading={isLoading}
        />
        
        <Separator className="my-4 bg-gray-200" />

        {/* Información personal */}
        <PersonalInfoSection 
          bio={profileData.bio || ''}
          yearsOfExperience={profileData.years_of_experience || 0}
          languagesSpoken={profileData.languages_spoken || []}
          isEditing={editingSections.basicInfo}
          toggleEditing={() => toggleEditSection('basicInfo')}
          handleSave={handleSaveBasicInfo}
          isLoading={isLoading}
          editedBio={editedBio}
          setEditedBio={setEditedBio}
        />

        <Separator className="my-4 bg-gray-200" />

        {/* Servicios */}
        <ServicesSection 
          services={profileData.services_offered || []}
          isEditing={editingSections.services}
          toggleEditing={() => toggleEditSection('services')}
          handleSave={handleSaveServices}
          isLoading={isLoading}
          editedServices={editedServices}
          setEditedServices={setEditedServices}
          newService={newService}
          setNewService={setNewService}
          addService={addService}
          removeService={removeService}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* SECCIÓN: Disponibilidad */}
        <AvailabilitySection 
          availability={profileData.availability || {}}
          userId={userId}
          isEditing={editingSections.availability}
          toggleEditing={() => toggleEditSection('availability')}
          handleSave={handleSaveAvailability}
          isLoading={isLoading}
          onAvailabilityUpdated={onAvailabilityUpdated}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* SECCIÓN: Ubicación */}
        <LocationSection 
          clinicAddress={profileData.clinic_address || ''}
          clinicLatitude={profileData.clinic_latitude}
          clinicLongitude={profileData.clinic_longitude}
          isEditing={editingSections.location}
          toggleEditing={() => toggleEditSection('location')}
          handleSave={handleSaveLocation}
          isLoading={isLoading}
          editedAddress={editedAddress}
          setEditedAddress={setEditedAddress}
          editedCoordinates={editedCoordinates}
          setEditedCoordinates={setEditedCoordinates}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* Servicios de emergencia */}
        <EmergencyServiceSection 
          hasEmergencyServices={profileData.emergency_services || false} 
        />
      </div>
    </div>
  );
};

export default VetProfilePreview;
