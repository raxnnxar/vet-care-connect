
import { useState, useEffect } from 'react';
import { GroomingService, GroomingProfile } from '@/features/auth/types/groomingTypes';

interface UseGroomingProfileEditorProps {
  profileData: GroomingProfile & { latitude?: number; longitude?: number };
  onSaveSection: (sectionData: Partial<GroomingProfile & { latitude?: number; longitude?: number }>, sectionName: string) => Promise<void>;
}

export const useGroomingProfileEditor = ({ 
  profileData, 
  onSaveSection
}: UseGroomingProfileEditorProps) => {
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({
    businessInfo: false,
    services: false,
    animals: false,
    availability: false,
    location: false
  });
  
  // Local state for editing sections
  const [editedBusinessName, setEditedBusinessName] = useState(profileData.business_name || '');
  const [editedServices, setEditedServices] = useState<GroomingService[]>(
    profileData.services_offered || []
  );
  const [editedAnimals, setEditedAnimals] = useState<string[]>(
    profileData.animals_accepted || []
  );
  const [editedLocation, setEditedLocation] = useState(
    (profileData as any).location || ''
  );
  const [editedCoordinates, setEditedCoordinates] = useState<{ lat: number; lng: number } | null>(
    profileData.latitude && profileData.longitude 
      ? { lat: profileData.latitude, lng: profileData.longitude }
      : null
  );
  
  // Update local state when profileData changes
  useEffect(() => {
    setEditedBusinessName(profileData.business_name || '');
    setEditedServices(profileData.services_offered || []);
    setEditedAnimals(profileData.animals_accepted || []);
    setEditedLocation((profileData as any).location || '');
    setEditedCoordinates(
      profileData.latitude && profileData.longitude 
        ? { lat: profileData.latitude, lng: profileData.longitude }
        : null
    );
  }, [profileData]);
  
  const toggleEditSection = (section: string) => {
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Reset local state to current profile data when starting to edit
    if (!editingSections[section]) {
      if (section === 'businessInfo') {
        setEditedBusinessName(profileData.business_name || '');
      } else if (section === 'services') {
        setEditedServices([...(profileData.services_offered || [])]);
      } else if (section === 'animals') {
        setEditedAnimals([...(profileData.animals_accepted || [])]);
      } else if (section === 'location') {
        setEditedLocation((profileData as any).location || '');
        setEditedCoordinates(
          profileData.latitude && profileData.longitude 
            ? { lat: profileData.latitude, lng: profileData.longitude }
            : null
        );
      }
    }
  };
  
  const handleSaveBusinessInfo = async () => {
    return await onSaveSection({ business_name: editedBusinessName }, 'información del negocio');
  };
  
  const handleSaveServices = async () => {
    return await onSaveSection({ services_offered: editedServices }, 'servicios');
  };
  
  const handleSaveAnimals = async () => {
    return await onSaveSection({ animals_accepted: editedAnimals }, 'animales aceptados');
  };
  
  const handleSaveLocation = async () => {
    const locationData = {
      location: editedLocation,
      latitude: editedCoordinates?.lat || null,
      longitude: editedCoordinates?.lng || null
    };
    return await onSaveSection(locationData, 'ubicación');
  };
  
  const handleSaveAvailability = async () => {
    toggleEditSection('availability');
    return Promise.resolve();
  };
  
  const addService = (newService: GroomingService) => {
    setEditedServices([...editedServices, newService]);
  };
  
  const removeService = (index: number) => {
    setEditedServices(editedServices.filter((_, i) => i !== index));
  };
  
  const toggleAnimal = (animalType: string) => {
    if (editedAnimals.includes(animalType)) {
      setEditedAnimals(editedAnimals.filter(animal => animal !== animalType));
    } else {
      setEditedAnimals([...editedAnimals, animalType]);
    }
  };
  
  return {
    editingSections,
    editedBusinessName,
    editedServices,
    editedAnimals,
    editedLocation,
    editedCoordinates,
    setEditedBusinessName,
    setEditedLocation,
    setEditedCoordinates,
    toggleEditSection,
    handleSaveBusinessInfo,
    handleSaveServices,
    handleSaveAnimals,
    handleSaveLocation,
    handleSaveAvailability,
    addService,
    removeService,
    toggleAnimal
  };
};
