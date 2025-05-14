import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Separator } from '@/ui/atoms/separator';
import { VeterinarianProfile, ServiceOffered, ANIMAL_TYPES, SPECIALIZATIONS } from '@/features/auth/types/veterinarianTypes';

// Importar los componentes de sección
import ProfileHero from './sections/ProfileHero';
import AnimalsSection from './sections/AnimalsSection';
import SpecializationsSection from './sections/SpecializationsSection';
import PersonalInfoSection from './sections/PersonalInfoSection';
import ServicesSection from './sections/ServicesSection';
import AvailabilitySection from './sections/AvailabilitySection';
import EmergencyServiceSection from './sections/EmergencyServiceSection';
import EducationSection from './sections/EducationSection';
import CertificationsSection from './sections/CertificationsSection';

interface VetProfilePreviewProps {
  profileData: VeterinarianProfile;
  userId: string;
  isLoading: boolean;
  onSaveSection: (sectionData: Partial<VeterinarianProfile>, sectionName: string) => Promise<void>;
}

const VetProfilePreview: React.FC<VetProfilePreviewProps> = ({ profileData, userId, isLoading, onSaveSection }) => {
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({
    basicInfo: false,
    services: false,
    animals: false,
    specializations: false,
    availability: false,
    education: false,
    certifications: false
  });
  
  // Local state for editing sections
  const [editedBio, setEditedBio] = useState(profileData.bio || '');
  const [editedServices, setEditedServices] = useState<ServiceOffered[]>(
    profileData.services_offered || []
  );
  const [editedAnimals, setEditedAnimals] = useState<string[]>(
    profileData.animals_treated || []
  );
  const [editedSpecializations, setEditedSpecializations] = useState<string[]>(
    profileData.specializations || []
  );
  const [newService, setNewService] = useState<ServiceOffered>({
    id: '',
    name: '',
    description: '',
    price: undefined
  });
  
  const toggleEditSection = (section: string) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Reset local state to current profile data when starting to edit
    if (!editingSections[section]) {
      if (section === 'basicInfo') {
        setEditedBio(profileData.bio || '');
      } else if (section === 'services') {
        setEditedServices([...(profileData.services_offered || [])]);
      } else if (section === 'animals') {
        setEditedAnimals([...(profileData.animals_treated || [])]);
      } else if (section === 'specializations') {
        setEditedSpecializations([...(profileData.specializations || [])]);
      }
    }
  };
  
  // Fix: Return a promise here to match the expected type
  const handleSaveBasicInfo = async () => {
    return await onSaveSection({ bio: editedBio }, 'información básica');
  };
  
  const handleSaveServices = async () => {
    return await onSaveSection({ services_offered: editedServices }, 'servicios');
  };
  
  const handleSaveAnimals = async () => {
    return await onSaveSection({ animals_treated: editedAnimals }, 'animales atendidos');
  };
  
  const handleSaveSpecializations = async () => {
    return await onSaveSection({ specializations: editedSpecializations }, 'especialidades');
  };
  
  const handleSaveEducation = async () => {
    toggleEditSection('education');
    return Promise.resolve();
  };
  
  const handleSaveCertifications = async () => {
    toggleEditSection('certifications');
    return Promise.resolve();
  };
  
  // Nueva función para guardar la disponibilidad
  const handleSaveAvailability = async () => {
    // No es necesario llamar a onSaveSection aquí porque
    // el propio AvailabilityEditor se encarga de guardar en Supabase
    return Promise.resolve();
  };
  
  const addService = () => {
    if (!newService.name) return;
    
    const serviceToAdd = {
      ...newService,
      id: uuidv4()
    };
    
    setEditedServices([...editedServices, serviceToAdd]);
    setNewService({
      id: '',
      name: '',
      description: '',
      price: undefined
    });
  };
  
  const removeService = (serviceId: string) => {
    setEditedServices(editedServices.filter(service => service.id !== serviceId));
  };
  
  const toggleAnimal = (animalType: string) => {
    if (editedAnimals.includes(animalType)) {
      setEditedAnimals(editedAnimals.filter(animal => animal !== animalType));
    } else {
      setEditedAnimals([...editedAnimals, animalType]);
    }
  };

  const toggleSpecialization = (specialization: string) => {
    if (editedSpecializations.includes(specialization)) {
      setEditedSpecializations(editedSpecializations.filter(spec => spec !== specialization));
    } else {
      setEditedSpecializations([...editedSpecializations, specialization]);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-gray-50 rounded-lg shadow overflow-hidden">
      {/* Hero section with profile image */}
      <ProfileHero 
        userId={userId} 
        profileData={profileData} 
      />
      
      {/* Content section - scroll único */}
      <div className="p-4 space-y-6">
        {/* Animales que atiende - MOVIDO ARRIBA */}
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

        {/* NUEVA SECCIÓN: Educación */}
        <EducationSection 
          educationEntries={profileData.education}
          isEditing={editingSections.education}
          toggleEditing={() => toggleEditSection('education')}
          handleSave={handleSaveEducation}
          isLoading={isLoading}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* NUEVA SECCIÓN: Certificaciones */}
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
        
        {/* SECCIÓN: Disponibilidad - Actualizada para pasar userId */}
        <AvailabilitySection 
          availability={profileData.availability || {}}
          userId={userId}
          isEditing={editingSections.availability}
          toggleEditing={() => toggleEditSection('availability')}
          handleSave={handleSaveAvailability}
          isLoading={isLoading}
        />
        
        <Separator className="my-4 bg-gray-200" />
        
        {/* MOVER: Servicios de emergencia */}
        <EmergencyServiceSection 
          hasEmergencyServices={profileData.emergency_services || false} 
        />
      </div>
    </div>
  );
};

export default VetProfilePreview;
