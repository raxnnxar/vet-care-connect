
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppSelector } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { Pet } from '@/features/pets/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { usePets } from '@/features/pets/hooks';
import { profileImageService } from '../api/profileImageService';
import PetManagementSection from '../components/PetManagementSection';
import ProfileSetupForm, { ProfileFormValues } from '../components/ProfileSetupForm';

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [currentPets, setCurrentPets] = useState<Pet[]>([]);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isFetchingPets, setIsFetchingPets] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { getCurrentUserPets } = usePets();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data: ownerExists, error: ownerCheckError } = await supabase
            .from('pet_owners')
            .select('id, phone_number, address')
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
      
      setIsUploadingImage(true);
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
          address: values.address,
          ...(profilePictureUrl && { profile_picture_url: profilePictureUrl }),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          address: values.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (profileError) {
        console.error('Error updating profile address:', profileError);
      }
      
      toast.success('Perfil actualizado con éxito');
      navigate(ROUTES.OWNER);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePetAdded = (newPet: Pet) => {
    setCurrentPets(prevPets => [...prevPets, newPet]);
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <Card className="shadow-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Completa tu perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfileSetupForm
            initialValues={{
              phoneNumber: '',
              address: '',
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetupScreen;
