
import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { usePets } from '@/features/pets/hooks';
import { Pet } from '@/features/pets/types';
import ProfileHeader from '../components/ProfileHeader';
import ContactInformation from '../components/ContactInformation';
import PetManagementSection from '../components/PetManagementSection';

const OwnerProfileScreen = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [userDetails, setUserDetails] = useState({
    phone: '',
    address: '',
    profilePicture: '',
  });
  const [showPetForm, setShowPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const { getCurrentUserPets, createPet, updatePet } = usePets();
  const [userPets, setUserPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('pet_owners')
          .select('phone_number, address, profile_picture_url')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserDetails({
            phone: data.phone_number || '',
            address: data.address || '',
            profilePicture: data.profile_picture_url || '',
          });
          setEditedPhone(data.phone_number || '');
          setEditedAddress(data.address || '');
        }

        try {
          const petsResult = await getCurrentUserPets();
          
          if (petsResult && 'payload' in petsResult && Array.isArray(petsResult.payload)) {
            setUserPets(petsResult.payload);
          }
        } catch (error) {
          console.error('Error fetching pets:', error);
          setUserPets([]);
        }
      }
    };

    fetchUserDetails();
  }, [user, getCurrentUserPets]);

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handlePetFormSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      // Make sure we assign the owner ID if it's not already set
      if (!petData.owner_id && user?.id) {
        petData.owner_id = user.id;
      }
      
      console.log('Submitting pet with data:', petData);
      
      if (editingPet) {
        console.log('Updating existing pet:', editingPet.id);
        const updatedPet = await updatePet(editingPet.id, petData);
        
        if (updatedPet) {
          const updatedPetData = updatedPet as Pet;
          setUserPets(prev => prev.map(p => p.id === editingPet.id ? updatedPetData : p));
          setShowPetForm(false);
          setEditingPet(null);
          return updatedPetData;
        }
      } else {
        console.log('Creating new pet with owner_id:', petData.owner_id);
        const newPet = await createPet(petData);
        console.log('Create pet result:', newPet);
        
        if (newPet) {
          const newPetData = newPet as Pet;
          console.log('New pet created:', newPetData);
          
          setUserPets(prev => [...prev, newPetData]);
          setShowPetForm(false);
          return newPetData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error saving pet:', error);
      return null;
    }
  };

  const handlePetUpdate = async (petData: any): Promise<Pet | null> => {
    try {
      if (!selectedPet) return null;
      
      const petUpdateData = { ...petData };
      
      if (petUpdateData.petPhotoFile) {
        const photoFile = petUpdateData.petPhotoFile;
        delete petUpdateData.petPhotoFile;
        
        if (photoFile) {
          console.log('Uploading pet photo separately');
          try {
            const uploadResult = await usePets().uploadProfilePicture(selectedPet.id, photoFile);
            if (uploadResult) {
              petUpdateData.profile_picture_url = uploadResult;
            }
          } catch (photoError) {
            console.error('Error uploading pet photo:', photoError);
          }
        }
      }
      
      if (petUpdateData.medicalHistory) {
        delete petUpdateData.medicalHistory;
      }
      
      const result = await updatePet(selectedPet.id, petUpdateData);
      
      if (result) {
        const updatedPet = result as Pet;
        setUserPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
        return updatedPet;
      }
      return null;
    } catch (error) {
      console.error('Error updating pet:', error);
      return null;
    }
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white font-medium text-lg">Mi Perfil</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="flex flex-col p-4 pb-20">
        <ProfileHeader 
          userDetails={userDetails} 
          user={user} 
          setUserDetails={setUserDetails}
        />

        <ContactInformation
          userDetails={userDetails}
          user={user}
          editedPhone={editedPhone}
          editedAddress={editedAddress}
          setEditedPhone={setEditedPhone}
          setEditedAddress={setEditedAddress}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setUserDetails={setUserDetails}
        />

        <PetManagementSection
          userPets={userPets}
          handlePetClick={handlePetClick}
          handlePetUpdate={handlePetUpdate}
          handlePetFormSubmit={handlePetFormSubmit}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          editingPet={editingPet}
          setEditingPet={setEditingPet}
          showPetForm={showPetForm}
          setShowPetForm={setShowPetForm}
        />
      </div>
    </LayoutBase>
  );
};

export default OwnerProfileScreen;
