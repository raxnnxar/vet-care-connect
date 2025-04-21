
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { ROUTES } from '@/frontend/shared/constants/routes';
import PetForm from '@/features/pets/components/PetForm';
import { Pet } from '@/features/pets/types';
import AddPetButton from '../components/AddPetButton';
import FinishSetupButton from '../components/FinishSetupButton';
import PhoneNumberField from '../components/PhoneNumberField';

const profileSchema = z.object({
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [showPetForm, setShowPetForm] = useState(false);
  const [currentPets, setCurrentPets] = useState<Pet[]>([]);
  const [isSubmittingPet, setIsSubmittingPet] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          if (data) {
            // Cast the data to include phone_number field which might be present
            const profileData = data as { phone_number?: string };
            form.setValue('phoneNumber', profileData.phone_number || '');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast.error('Error al cargar el perfil');
        } finally {
          setIsProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [form, user]);

  const handleAddPetClick = () => {
    setShowPetForm(true);
  };

  const handlePetSubmit = async (petData: any): Promise<Pet | null> => {
    setIsSubmittingPet(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newPet = { ...petData, id: String(Date.now()) };
      setCurrentPets((prevPets) => [...prevPets, newPet]);
      setShowPetForm(false);
      toast.success('Mascota agregada con éxito');
      return newPet;
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      toast.error('Error al agregar la mascota');
      return null;
    } finally {
      setIsSubmittingPet(false);
    }
  };

  const handleFinishSetup = () => {
    navigate(ROUTES.OWNER);
  };

  if (isProfileLoading) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Completa tu perfil</h1>
      
      <PhoneNumberField
        value={form.watch('phoneNumber')}
        onChange={(value) => form.setValue('phoneNumber', value)}
        label="Número de teléfono"
        placeholder="Ingresa tu número de teléfono"
        helpText="Este número se usará para comunicaciones sobre citas"
      />
      
      <AddPetButton
        hasPets={currentPets.length > 0}
        onClick={handleAddPetClick}
      />
      
      <FinishSetupButton
        onClick={handleFinishSetup}
      />
      
      {showPetForm && (
        <PetForm
          mode="create"
          onSubmit={handlePetSubmit}
          isSubmitting={isSubmittingPet}
          onCancel={() => setShowPetForm(false)}
        />
      )}
    </div>
  );
};

export default ProfileSetupScreen;
