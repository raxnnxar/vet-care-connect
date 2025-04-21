import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { ROUTES } from '@/frontend/shared/constants/routes';
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
import { authActions } from '../store/authSlice';
import { profileService } from '../api/profileService';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import PetForm from '@/features/pets/components/PetForm';
import { usePets } from '@/features/pets/hooks';
import PetPhotoUploadDialog from '@/features/pets/components/PetPhotoUploadDialog';
import ProfileImageUploader from '@/features/auth/components/ProfileImageUploader';
import PhoneNumberField from '@/features/auth/components/PhoneNumberField';
import PetList from '@/features/auth/components/PetList';
import AddPetButton from '@/features/auth/components/AddPetButton';
import FinishSetupButton from '@/features/auth/components/FinishSetupButton';

interface FormValues {
  phone: string;
}

interface PetData {
  id: string;
  name: string;
  species: string;
  breed?: string;
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

  useEffect(() => {
    if (user?.id) {
      getCurrentUserPets();
    }
  }, [user, getCurrentUserPets]);

  useEffect(() => {
    if (userPets && userPets.length > 0) {
      const mappedPets: PetData[] = userPets.map(pet => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '',
        profile_picture_url: pet.profile_picture_url
      }));
      setPets(mappedPets);
    }
  }, [userPets]);

  useEffect(() => {
    if (petSuccessAlert) {
      const timer = setTimeout(() => {
        setPetSuccessAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
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
        return null;
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
      setIsSubmitting(true);
      
      if (!user?.id) {
        toast.error('Error: No se pudo identificar al usuario');
        setIsSubmitting(false);
        return null;
      }
      
      const completeData = {
        ...petData,
        owner_id: user.id
      };
      
      const newPet = await createPet(completeData);
      
      if (newPet) {
        setIsPetDialogOpen(false);
        setNewPetId(newPet.id);
        setNewPetName(newPet.name);
        setPetSuccessAlert(true);
        
        // If the pet has a photo, show the photo upload dialog
        if (petData.hasPhoto) {
          setShowPhotoUploadDialog(true);
        }
        
        return newPet;
      } else {
        toast.error('Error al crear la mascota');
        return null;
      }
    } catch (error) {
      console.error('Error creating pet:', error);
      toast.error('Error al crear la mascota');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      console.log('Starting profile finish process');
      
      // Validate phone number
      if (!form.getValues().phone) {
        toast.error('Por favor, ingresa un número de teléfono');
        setIsSubmitting(false);
        return;
      }
      
      // Upload profile picture if available
      let profilePictureUrl = null;
      if (profileImageFile) {
        profilePictureUrl = await uploadProfilePicture();
      }
      
      // First, ensure the user has a role in the database
      if (!user?.id) {
        toast.error('Error: No se pudo identificar al usuario');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Explicitly setting user role to pet_owner in database');
      
      // Explicitly set the user role to pet_owner in the database
      const { error: roleError } = await supabase
        .from('users')
        .update({ 
          role: 'pet_owner',
          phone_number: form.getValues().phone,
          profile_picture_url: profilePictureUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (roleError) {
        console.error('Error updating user role:', roleError);
        toast.error('Error al actualizar el perfil');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Database update successful, updating Redux state');
      
      // Use the proper action creator from authActions
      dispatch(authActions.setUserRole({
        ...user,
        role: 'pet_owner',
        phone: form.getValues().phone,
        profileImage: profilePictureUrl
      }));
      
      toast.success('Perfil actualizado con éxito');
      
      console.log('Profile setup complete, forcing navigation to owner home');
      
      // Close dialog first to prevent any interference
      setIsFinishDialogOpen(false);
      
      // Force navigation to owner home with replace to prevent back navigation
      setTimeout(() => {
        navigate('/owner', { replace: true });
      }, 100);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 max-w-md mx-auto w-full p-4">
        <h1 className="text-2xl font-bold text-center my-6">Completa tu Perfil</h1>
        
        <Form {...form}>
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <ProfileImageUploader
                profileImage={profileImage}
                setProfileImage={setProfileImage}
                setProfileImageFile={setProfileImageFile}
                isUploading={isUploading}
                displayName={user?.displayName}
              />
            </div>
            
            {/* Phone Number */}
            <div className="space-y-2">
              <PhoneNumberField
                form={form}
                name="phone"
                label="Número de Teléfono"
                placeholder="Ej: +12345678"
                helpText="Ingresa tu número de teléfono con código de país"
              />
            </div>
            
            {/* Pets Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Mis Mascotas</h2>
              
              {/* Pet List */}
              <PetList pets={pets} isLoading={isPetsLoading} />
              
              {/* Add Pet Button */}
              <AddPetButton onClick={() => setIsPetDialogOpen(true)} />
            </div>
            
            {/* Finish Setup Button */}
            <FinishSetupButton onClick={() => setIsFinishDialogOpen(true)} />
          </div>
        </Form>
      </div>
      
      {/* Pet Form Dialog */}
      <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Mascota</DialogTitle>
          </DialogHeader>
          <PetForm onSubmit={handleAddPet} isSubmitting={isSubmitting} onCancel={() => setIsPetDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Pet Photo Upload Dialog */}
      {showPhotoUploadDialog && newPetId && (
        <PetPhotoUploadDialog
          petId={newPetId}
          petName={newPetName}
          isOpen={showPhotoUploadDialog}
          onClose={() => setShowPhotoUploadDialog(false)}
        />
      )}
      
      {/* Success Alert */}
      {petSuccessAlert && (
        <Alert className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-sm bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            ¡Mascota agregada con éxito!
          </AlertDescription>
        </Alert>
      )}
      
      {/* Finish Confirmation Dialog */}
      <AlertDialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar configuración</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas finalizar la configuración de tu perfil?
              {pets.length === 0 && (
                <p className="mt-2 text-amber-600">
                  No has agregado ninguna mascota. Puedes agregarlas más tarde desde tu perfil.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinish} disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Finalizar y continuar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileSetupScreen;
