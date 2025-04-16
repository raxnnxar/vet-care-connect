
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Form } from '@/ui/molecules/form';
import { Alert, AlertDescription } from "@/ui/molecules/alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/molecules/alert-dialog";
import { updateProfile } from '../store/authThunks';
import { profileService } from '../api/profileService';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import PetForm from '@/features/pets/components/PetForm';
import { usePets } from '@/features/pets/hooks';
import PetPhotoUploadDialog from '@/features/pets/components/PetPhotoUploadDialog';

// Import component files
import ProfileImageUploader from '../components/ProfileImageUploader';
import PhoneNumberField from '../components/PhoneNumberField';
import PetList from '../components/PetList';
import AddPetButton from '../components/AddPetButton';
import FinishSetupButton from '../components/FinishSetupButton';

interface FormValues {
  phone: string;
}

// Update the PetData interface to match Pet type from the API
interface PetData {
  id: string;
  name: string;
  species: string;
  breed?: string; // Now optional to match Pet type
  profile_picture_url?: string;
}

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { createPet, isLoading: isPetLoading, getCurrentUserPets, pets: userPets, isLoading: isPetsLoading } = usePets();
  
  const [pets, setPets] = useState<PetData[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPetId, setNewPetId] = useState<string | null>(null);
  const [newPetName, setNewPetName] = useState<string>('');
  const [showPhotoUploadDialog, setShowPhotoUploadDialog] = useState(false);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);
  const [petSuccessAlert, setPetSuccessAlert] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      phone: '',
    },
  });

  // Fetch user's pets when component mounts or when a new pet is added
  useEffect(() => {
    if (user?.id) {
      getCurrentUserPets();
    }
  }, [user, getCurrentUserPets]);

  // Update local pets state when userPets changes
  useEffect(() => {
    if (userPets && userPets.length > 0) {
      // Map the Pet[] to PetData[] to ensure type compatibility
      const mappedPets: PetData[] = userPets.map(pet => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '', // Provide default empty string if breed is undefined
        profile_picture_url: pet.profile_picture_url
      }));
      setPets(mappedPets);
    }
  }, [userPets]);

  // Hide success alert after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (petSuccessAlert) {
      timer = setTimeout(() => {
        setPetSuccessAlert(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [petSuccessAlert]);

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!user?.id || !profileImageFile) return null;
    
    setIsUploading(true);
    try {
      try {
        const fileName = `${user.id}-${uuidv4()}`;
        const { data, error } = await supabase.storage
          .from('pet-owners-profile-pictures')
          .upload(fileName, profileImageFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
          .from('pet-owners-profile-pictures')
          .getPublicUrl(fileName);
          
        return publicUrlData.publicUrl;
      } catch (supabaseError) {
        console.error('Supabase storage error:', supabaseError);
        const imageUrl = await profileService.uploadProfileImage(user.id, profileImageFile);
        return imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen de perfil');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPet = async (petData: any) => {
    try {
      // Set a local loading state to show feedback to user
      setIsSubmitting(true);
      
      if (!user?.id) {
        toast.error('Error: No se pudo identificar al usuario');
        setIsSubmitting(false);
        return null;
      }
      
      // Add owner ID to the pet data
      const completeData = {
        ...petData,
        owner_id: user.id
      };
      
      console.log('Adding pet with data:', completeData);
      
      // Call the createPet function from the usePets hook
      const result = await createPet(completeData);
      
      if (result && result.id) {
        console.log('Pet created successfully:', result);
        
        // Add the newly created pet to the local state
        const newPet = {
          id: result.id,
          name: result.name,
          species: result.species,
          breed: result.breed || '',
          profile_picture_url: result.profile_picture_url,
        };
        
        setPets((prevPets) => [...prevPets, newPet]);
        
        // Close the pet dialog
        setIsPetDialogOpen(false);
        
        // Set the new pet ID and name for the photo upload dialog
        setNewPetId(result.id);
        setNewPetName(result.name);
        
        // Show the success alert
        setPetSuccessAlert(true);
        
        // Show the photo upload dialog immediately after a small delay 
        // to ensure proper state updates
        setTimeout(() => {
          setShowPhotoUploadDialog(true);
        }, 100);
        
        // Refresh the pets list
        getCurrentUserPets();
        
        return result;
      } else {
        toast.error('Error al agregar la mascota: No se recibieron datos');
        return null;
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error('Error al agregar la mascota');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(data.phone)) {
        toast.error('Por favor ingresa un número telefónico válido');
        setIsSubmitting(false);
        return;
      }

      let imageUrl = null;
      if (profileImageFile) {
        imageUrl = await uploadProfilePicture();
        if (!imageUrl && profileImageFile) {
          toast.error('Error al subir la imagen de perfil');
          setIsSubmitting(false);
          return;
        }
      }

      await dispatch(updateProfile({
        phone: data.phone,
        profileImage: imageUrl,
      }) as any);

      toast.success('¡Perfil completado exitosamente!');
      navigate('/owner');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al guardar el perfil. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // This function now only opens the confirmation dialog when clicked on the "Finalizar y continuar" button
  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    // Ensure we're not in the middle of any other process
    if (!isSubmitting && !showPhotoUploadDialog && !isPetDialogOpen) {
      setIsFinishDialogOpen(true);
    }
  };

  // This function handles the actual submission when user confirms
  const handleConfirmFinish = async () => {
    const data = form.getValues();
    await handleSubmit(data);
    setIsFinishDialogOpen(false);
  };

  const handlePhotoDialogClose = (wasPhotoAdded: boolean) => {
    setShowPhotoUploadDialog(false);
    setNewPetId(null);
    
    if (wasPhotoAdded) {
      toast.success('Foto de mascota guardada exitosamente');
      // Refresh the pets list after photo upload
      getCurrentUserPets();
    }
  };

  // Handle closing pet dialog - ensure we properly clean up state
  const handlePetDialogOpenChange = (isOpen: boolean) => {
    // Only allow closing if not currently submitting
    if (!isSubmitting || !isOpen) {
      setIsPetDialogOpen(isOpen);
    }
  };
  
  // Handle confirmation dialog state change with proper cleanup
  const handleConfirmDialogChange = (isOpen: boolean) => {
    if (!isSubmitting) {
      setIsFinishDialogOpen(isOpen);
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-6 overflow-y-auto">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Completa tu Perfil</h1>
        
        {petSuccessAlert && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              ¡Mascota agregada con éxito!
            </AlertDescription>
          </Alert>
        )}
        
        <ProfileImageUploader
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          setProfileImageFile={setProfileImageFile}
          isUploading={isUploading}
          displayName={user?.displayName}
        />

        <Form {...form}>
          <form onSubmit={handleFinish} className="space-y-6">
            <PhoneNumberField control={form.control} />

            <div className="space-y-4 mt-6">
              <h2 className="text-base font-medium mb-2">Mis Mascotas</h2>
              
              <PetList pets={pets} isLoading={isPetsLoading} />

              <Dialog 
                open={isPetDialogOpen} 
                onOpenChange={handlePetDialogOpenChange}
              >
                <AddPetButton 
                  onClick={() => setIsPetDialogOpen(true)} 
                  hasPets={pets.length > 0}
                />
                
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-0">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Agregar Nueva Mascota</DialogTitle>
                  </DialogHeader>
                  <div className="px-6 py-4">
                    <PetForm 
                      onSubmit={handleAddPet} 
                      isSubmitting={isSubmitting || isPetLoading} 
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <FinishSetupButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </div>
      
      {/* Photo upload dialog - This appears after adding a pet */}
      {showPhotoUploadDialog && newPetId && (
        <PetPhotoUploadDialog
          isOpen={showPhotoUploadDialog}
          petId={newPetId}
          petName={newPetName}
          onClose={handlePhotoDialogClose}
        />
      )}
      
      {/* Finish confirmation dialog - This only appears when clicking "Finalizar y continuar" */}
      <AlertDialog 
        open={isFinishDialogOpen} 
        onOpenChange={handleConfirmDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro que deseas continuar?</AlertDialogTitle>
            <AlertDialogDescription>
              Una vez que finalices la configuración de tu perfil, serás dirigido al panel principal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFinish} className="bg-accent3">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileSetupScreen;
