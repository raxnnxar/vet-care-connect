
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppSelector } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/features/pets/types';
import { usePets } from '@/features/pets/hooks';
import { profileImageService } from '../api/profileImageService';
import PetManagementSection from '../components/PetManagementSection';
import ProfileSetupForm, { ProfileFormValues } from '../components/ProfileSetupForm';
import FinishSetupButton from '../components/FinishSetupButton';

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [currentPets, setCurrentPets] = useState<Pet[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isFetchingPets, setIsFetchingPets] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { getCurrentUserPets } = usePets();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data: ownerExists, error: ownerCheckError } = await supabase
            .from('pet_owners')
            .select('id, phone_number')
            .eq('id', user.id)
            .single();
          
          if (!ownerExists || ownerCheckError) {
            console.log('Creating pet_owners record for user', user.id);
            const { error: createOwnerError } = await supabase
              .from('pet_owners')
              .insert({ id: user.id });
              
            if (createOwnerError) {
              console.error('Error creating owner record:', createOwnerError);
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Error al cargar el perfil');
        } finally {
          setIsProfileLoading(false);
        }
      }
    };

    const fetchPets = async () => {
      if (user?.id) {
        try {
          setIsFetchingPets(true);
          const result = await getCurrentUserPets();
          
          console.log('Fetched pets during profile setup:', result);
          
          if (result && result.payload && Array.isArray(result.payload)) {
            setCurrentPets(result.payload);
          }
        } catch (error) {
          console.error('Error fetching pets:', error);
          setCurrentPets([]);
        } finally {
          setIsFetchingPets(false);
        }
      }
    };

    fetchUserProfile();
    fetchPets();
  }, [user, getCurrentUserPets]);

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    try {
      if (!user?.id) {
        toast.error('Usuario no encontrado');
        return;
      }
      
      setIsSaving(true);
      let profilePictureUrl = null;
      
      if (profileImageFile) {
        try {
          profilePictureUrl = await profileImageService.uploadProfileImage(
            user.id,
            profileImageFile
          );
        } catch (error) {
          console.error('Error uploading profile image:', error);
          toast.error('Error al subir la imagen de perfil');
        }
      }
      
      const { error } = await supabase
        .from('pet_owners')
        .update({
          phone_number: values.phoneNumber,
          ...(profilePictureUrl && { profile_picture_url: profilePictureUrl }),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Información guardada con éxito');
      navigate('/location-setup');
    } catch (error) {
      console.error('Error al guardar la información:', error);
      toast.error('Error al guardar la información');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePetAdded = (newPet: Pet) => {
    console.log('New pet added during profile setup:', newPet);
    setCurrentPets(prevPets => [...prevPets, newPet]);
  };

  const isFormValid = true; // Simplificado para este ejemplo

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#79D0B8]">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#79D0B8] py-8 px-4 flex flex-col">
      <div className="container mx-auto max-w-md flex-grow">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Completa tu perfil
          </h2>
        </div>
        
        <div className="space-y-8 mb-24">
          <ProfileSetupForm
            initialValues={{
              phoneNumber: '',
            }}
            onSubmit={handleProfileSubmit}
            isLoading={isUploadingImage}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            setProfileImageFile={setProfileImageFile}
            isUploadingImage={isUploadingImage}
            displayName={user?.displayName}
          />
          
          <PetManagementSection
            pets={currentPets}
            isLoading={isFetchingPets}
            onPetAdded={handlePetAdded}
          />
        </div>
      </div>
      
      {/* Botón fijo en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#79D0B8] shadow-lg">
        <div className="container mx-auto max-w-md">
          <FinishSetupButton
            onClick={() => handleProfileSubmit({
              phoneNumber: '',  // Deberías obtener los valores reales del formulario aquí
            })}
            disabled={!isFormValid || isSaving}
            text="Guardar y continuar"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
