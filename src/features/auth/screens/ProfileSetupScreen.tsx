
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Info, Loader2, Pencil, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/ui/molecules/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/molecules/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/molecules/tooltip';
import { updateProfile } from '../store/authThunks';
import { profileService } from '../api/profileService';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import PetForm from '@/features/pets/components/PetForm';
import { usePets } from '@/features/pets/hooks';
import PetPhotoUploadDialog from '@/features/pets/components/PetPhotoUploadDialog';
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
import { Alert, AlertDescription } from "@/ui/molecules/alert";

interface FormValues {
  phone: string;
}

interface PetData {
  id: string;
  name: string;
  species: string;
  breed: string;
}

const ProfileSetupScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { createPet, isLoading: isPetLoading } = usePets();
  
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      phone: '',
    },
  });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      setProfileImageFile(file);
      
    } catch (error) {
      console.error('Error handling image:', error);
      toast.error('Error al procesar la imagen');
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
        };
        
        setPets((prevPets) => [...prevPets, newPet]);
        
        // Close the pet dialog
        setIsPetDialogOpen(false);
        
        // Set the new pet ID and name for the photo upload dialog
        setNewPetId(result.id);
        setNewPetName(result.name);
        
        // Show the success alert
        setPetSuccessAlert(true);
        
        // Show the photo upload dialog immediately
        setShowPhotoUploadDialog(true);
        
        // Clear submission state
        setIsSubmitting(false);
        
        return result;
      } else {
        toast.error('Error al agregar la mascota: No se recibieron datos');
        setIsSubmitting(false);
        return null;
      }
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error('Error al agregar la mascota');
      setIsSubmitting(false);
      return null;
    }
  };

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

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoDialogClose = (wasPhotoAdded: boolean) => {
    setShowPhotoUploadDialog(false);
    
    if (wasPhotoAdded) {
      toast.success('Foto de mascota guardada exitosamente');
    }
  };

  const handleFinish = () => {
    setIsFinishDialogOpen(true);
  };

  const handleConfirmFinish = () => {
    navigate('/owner');
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4 md:px-6">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Completa tu Perfil</h1>
        
        {petSuccessAlert && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">
              ¡Mascota agregada con éxito!
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-28 w-28 border-4 border-primary/30">
              <AvatarImage src={profileImage || undefined} alt="Foto de perfil" className="object-cover" />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                {user?.displayName ? getInitials(user.displayName) : 'U'}
              </AvatarFallback>
            </Avatar>
            
            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors"
              aria-label="Cambiar foto de perfil"
            >
              <Pencil className="h-4 w-4" />
            </button>
            
            <input 
              ref={fileInputRef}
              id="profile-image" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-sm text-muted-foreground">Agrega una foto de perfil</p>
          
          {isUploading && (
            <div className="mt-2 flex items-center text-sm text-primary">
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              <span>Subiendo imagen...</span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 mb-1.5">
                    <FormLabel className="text-base font-medium">Número de Teléfono</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[280px]">
                          <p className="text-sm">
                            Tu número de teléfono se utilizará como contacto de emergencia
                            para los veterinarios y para prevenir el abandono de mascotas.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="Ej: +123456789" 
                      {...field} 
                      className="text-base md:text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 mt-6">
              <h2 className="text-base font-medium mb-2">Mis Mascotas</h2>

              <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
                {pets.length === 0 ? (
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-dashed border-gray-300 flex flex-col h-auto py-6 px-4 items-center gap-2 w-full max-w-sm"
                    onClick={() => setIsPetDialogOpen(true)}
                  >
                    <Plus className="h-8 w-8 text-accent1" />
                    <span className="text-center text-muted-foreground">
                      Agrega tu primera mascota
                    </span>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <ul className="space-y-3">
                      {pets.map((pet) => (
                        <li key={pet.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <div>
                            <p className="font-medium">{pet.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {pet.species} {pet.breed ? `· ${pet.breed}` : ''}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      className="border-dashed border-gray-300 flex h-auto py-4 px-4 items-center gap-2 w-full"
                      onClick={() => setIsPetDialogOpen(true)}
                    >
                      <Plus className="h-5 w-5 text-accent1" />
                      <span className="text-muted-foreground">
                        Agregar otra mascota
                      </span>
                    </Button>
                  </div>
                )}
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-0">
                  <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Agregar Nueva Mascota</DialogTitle>
                  </DialogHeader>
                  <div className="px-6 py-4">
                    <PetForm onSubmit={handleAddPet} isSubmitting={isSubmitting || isPetLoading} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-8">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-white py-4 px-6 text-base font-medium"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar perfil'
                )}
              </Button>

              <Button 
                type="button"
                onClick={handleFinish}
                className="bg-accent3 hover:bg-accent3/90 text-white py-4 px-6 text-base font-medium flex items-center justify-center"
              >
                Finalizar y continuar
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      {/* Photo upload dialog */}
      {showPhotoUploadDialog && newPetId && (
        <PetPhotoUploadDialog
          isOpen={showPhotoUploadDialog}
          petId={newPetId}
          petName={newPetName}
          onClose={handlePhotoDialogClose}
        />
      )}

      {/* Finish confirmation dialog */}
      <AlertDialog open={isFinishDialogOpen} onOpenChange={setIsFinishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quieres finalizar la configuración?</AlertDialogTitle>
            <AlertDialogDescription>
              {pets.length > 0 
                ? 'Has agregado mascotas a tu perfil. ¿Quieres continuar a la pantalla principal?' 
                : '¿Estás seguro que deseas continuar sin agregar mascotas?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmFinish}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfileSetupScreen;
