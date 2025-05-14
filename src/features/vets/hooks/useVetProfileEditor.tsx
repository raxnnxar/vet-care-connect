
import { useState, useEffect } from 'react';
import { ServiceOffered, VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import { v4 as uuidv4 } from 'uuid';

interface UseVetProfileEditorProps {
  profileData: VeterinarianProfile;
  onSaveSection: (sectionData: Partial<VeterinarianProfile>, sectionName: string) => Promise<void>;
  onAvailabilityUpdated?: () => Promise<void>;
}

export const useVetProfileEditor = ({ 
  profileData, 
  onSaveSection,
  onAvailabilityUpdated 
}: UseVetProfileEditorProps) => {
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
  
  // Update local state when profileData changes
  useEffect(() => {
    setEditedBio(profileData.bio || '');
    setEditedServices(profileData.services_offered || []);
    setEditedAnimals(profileData.animals_treated || []);
    setEditedSpecializations(profileData.specializations || []);
  }, [profileData]);
  
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
  
  // Function to save availability and update the UI
  const handleSaveAvailability = async () => {
    // First call parent's availability update function
    if (onAvailabilityUpdated) {
      await onAvailabilityUpdated();
    }
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
  
  return {
    editingSections,
    editedBio,
    editedServices,
    editedAnimals,
    editedSpecializations,
    newService,
    setEditedBio,
    setEditedServices,
    setNewService,
    toggleEditSection,
    handleSaveBasicInfo,
    handleSaveServices,
    handleSaveAnimals,
    handleSaveSpecializations,
    handleSaveEducation,
    handleSaveCertifications,
    handleSaveAvailability,
    addService,
    removeService,
    toggleAnimal,
    toggleSpecialization
  };
};
