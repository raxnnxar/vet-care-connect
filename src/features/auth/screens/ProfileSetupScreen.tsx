
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
import ProfileAddressField from '../components/ProfileAddressField';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import PetList from '../components/PetList';
import PetPhotoUploadDialog from '@/features/pets/components/PetPhotoUploadDialog';
import { usePets } from '@/features/pets/hooks';

const profileSchema = z.object({
  phoneNumber: z.string().min(1, 'El número de teléfono es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [showPetForm, setShowPetForm] = useState(false);
  const [currentPets, setCurrentPets] = useState<Pet[]>([]);
  const [isSubmittingPet, setIsSubmittingPet] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [currentPetId, setCurrentPetId] = useState<string>('');
  const [currentPetName, setCurrentPetName] = useState<string>('');
  const [isFetchingPets, setIsFetchingPets] = useState(true);
  const { getCurrentUserPets, createPet } = usePets();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: '',
      address: '',
    },
  });

  const isFormValid = form.watch('phoneNumber').length > 0;

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
            const profileData = data as { phone_number?: string; address?: string };
            form.setValue('phoneNumber', profileData.phone_number || '');
            form.setValue('address', profileData.address || '');
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
          
          // Check if result exists and has a payload property that is an array
          if (result && 'payload' in result && Array.isArray(result.payload)) {
            setCurrentPets(result.payload);
          } else {
            console.log('No pets found or invalid response format');
            setCurrentPets([]);
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
  }, [form, user, getCurrentUserPets]);

  const handleAddPetClick = () => {
    setShowPetForm(true);
  };

  const handlePetSubmit = async (petData: any): Promise<Pet | null> => {
    console.log("Pet submission started with data:", petData);
    setIsSubmittingPet(true);
    try {
      if (!user?.id) {
        toast.error('Usuario no encontrado');
        return null;
      }
      
      // Create the pet in the database
      console.log("Creating pet with owner ID:", user.id);
      const newPet = await createPet({
        ...petData,
        owner_id: user.id
      });
      
      console.log("Pet creation result:", newPet);
      if (newPet) {
        // Add to local state
        setCurrentPets((prevPets) => [...prevPets, newPet]);
        setShowPetForm(false);
        
        // Show photo upload dialog
        setCurrentPetId(newPet.id);
        setCurrentPetName(newPet.name);
        setShowPhotoDialog(true);
        
        toast.success('Mascota agregada con éxito');
        return newPet;
      }
      return null;
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      toast.error('Error al agregar la mascota');
      return null;
    } finally {
      setIsSubmittingPet(false);
    }
  };

  const handlePhotoDialogClose = (wasPhotoAdded: boolean) => {
    setShowPhotoDialog(false);
    
    if (wasPhotoAdded && user?.id) {
      // Refresh pets list to show the updated photo
      getCurrentUserPets().then((result) => {
        if (result && 'payload' in result && Array.isArray(result.payload)) {
          setCurrentPets(result.payload);
        }
      });
    }
  };

  const handleFinishSetup = async () => {
    if (!isFormValid) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    
    try {
      const values = form.getValues();
      
      if (user?.id) {
        // Update profile in database
        const { error } = await supabase
          .from('profiles')
          .update({
            phone_number: values.phoneNumber,
            address: values.address,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (error) throw error;
        
        toast.success('Perfil actualizado con éxito');
        navigate(ROUTES.OWNER);
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast.error('Error al actualizar el perfil');
    }
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
          <CardTitle className="text-2xl text-center text-primary">Completa tu perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PhoneNumberField
            value={form.watch('phoneNumber')}
            onChange={(value) => form.setValue('phoneNumber', value)}
            label="Número de teléfono"
            placeholder="Ingresa tu número de teléfono"
            helpText="Esto lo pedimos para prevenir el abandono de mascotas y poder contactar con los dueños en caso de ser necesario."
          />
          
          <ProfileAddressField
            value={form.watch('address')}
            onChange={(value) => form.setValue('address', value)}
            label="Dirección"
            placeholder="Ingresa tu dirección"
            helpText="Esto lo pedimos para prevenir el abandono de mascotas y poder contactar con los dueños en caso de ser necesario."
          />
          
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Tus mascotas</h3>
            
            <PetList 
              pets={currentPets} 
              isLoading={isFetchingPets} 
            />
            
            <AddPetButton
              hasPets={currentPets.length > 0}
              onClick={handleAddPetClick}
            />
          </div>
          
          <div className="mt-8">
            <FinishSetupButton
              onClick={handleFinishSetup}
              disabled={!isFormValid}
            />
          </div>
        </CardContent>
      </Card>
      
      {showPetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg transform transition-all animate-scale-in">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Agregar mascota</h2>
              <PetForm
                mode="create"
                onSubmit={handlePetSubmit}
                isSubmitting={isSubmittingPet}
                onCancel={() => setShowPetForm(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {showPhotoDialog && (
        <PetPhotoUploadDialog
          isOpen={showPhotoDialog}
          petId={currentPetId}
          petName={currentPetName}
          onClose={handlePhotoDialogClose}
        />
      )}
    </div>
  );
};

export default ProfileSetupScreen;
