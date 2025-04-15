
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Plus, Info, Loader2, CheckCircle2, XCircle } from 'lucide-react';
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
  DialogTrigger,
  DialogFooter,
} from '@/ui/molecules/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/molecules/tooltip';
import { updateProfile } from '../store/authThunks';
import { profileService } from '../api/profileService';
import { v4 as uuidv4 } from 'uuid';

interface FormValues {
  phone: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
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
  
  const [pets, setPets] = useState<PetData[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      phone: '',
      petName: '',
      petSpecies: '',
      petBreed: '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Display image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Store file for upload
      setProfileImageFile(file);
      
    } catch (error) {
      console.error('Error handling image:', error);
      toast.error('Error al procesar la imagen');
    }
  };

  const handleAddPet = (data: { petName: string, petSpecies: string, petBreed: string }) => {
    if (!data.petName || !data.petSpecies) {
      toast.error('El nombre y la especie de la mascota son obligatorios');
      return;
    }
    
    const newPet = {
      id: `pet-${uuidv4()}`,
      name: data.petName,
      species: data.petSpecies,
      breed: data.petBreed,
    };
    
    setPets([...pets, newPet]);
    setIsPetDialogOpen(false);
    form.reset({
      phone: form.getValues('phone'),
      petName: '',
      petSpecies: '',
      petBreed: '',
    });
    toast.success('Mascota agregada exitosamente');
  };

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!user?.id || !profileImageFile) return null;
    
    setIsUploading(true);
    try {
      const imageUrl = await profileService.uploadProfileImage(user.id, profileImageFile);
      return imageUrl;
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
      
      // Validate phone number (simple validation for now)
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(data.phone)) {
        toast.error('Por favor ingresa un número telefónico válido');
        setIsSubmitting(false);
        return;
      }

      // Upload profile image if available
      let imageUrl = null;
      if (profileImageFile) {
        imageUrl = await uploadProfilePicture();
        if (!imageUrl && profileImageFile) {
          toast.error('Error al subir la imagen de perfil');
          setIsSubmitting(false);
          return;
        }
      }

      // Update profile with phone number and image
      await dispatch(updateProfile({
        phone: data.phone,
        profileImage: imageUrl,
        // In a real app, we would also save pets to the database here
      }) as any);

      // Navigate to owner dashboard after successful completion
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

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center mb-8">Completa tu Perfil</h1>
        
        <div className="flex flex-col items-center mb-8">
          <div 
            className="relative mb-4 group cursor-pointer"
            onClick={triggerFileInput}
          >
            <div className={`h-32 w-32 rounded-full overflow-hidden border-4 ${profileImage ? 'border-primary' : 'border-gray-200'} transition-all hover:border-primary`}>
              <Avatar className="h-full w-full">
                <AvatarImage src={profileImage || undefined} alt="Foto de perfil" className="object-cover" />
                <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                  {user?.displayName ? getInitials(user.displayName) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-3 shadow-md hover:bg-primary/90 transition-colors">
              <Camera className="h-5 w-5" />
            </div>
            
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
              <p className="text-white font-medium">Cambiar foto</p>
            </div>
            
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Mis Mascotas</Label>
                <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      className="bg-accent1 hover:bg-accent1/90 text-white"
                      size="default"
                    >
                      <Plus className="mr-1.5 h-5 w-5" />
                      Agregar Mascota
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Mascota</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="petName">Nombre *</Label>
                        <Input 
                          id="petName"
                          {...form.register('petName')}
                          placeholder="Nombre de tu mascota"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="petSpecies">Especie *</Label>
                        <Input 
                          id="petSpecies"
                          {...form.register('petSpecies')}
                          placeholder="Ej: Perro, Gato, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="petBreed">Raza</Label>
                        <Input 
                          id="petBreed"
                          {...form.register('petBreed')}
                          placeholder="Opcional"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button" 
                        onClick={() => {
                          const petData = {
                            petName: form.getValues('petName'),
                            petSpecies: form.getValues('petSpecies'),
                            petBreed: form.getValues('petBreed'),
                          };
                          handleAddPet(petData);
                        }}
                      >
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {pets.length === 0 ? (
                <div className="flex justify-center mt-4 mb-2">
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
                </div>
              ) : (
                <ul className="space-y-3 mt-4">
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
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base font-medium mt-6"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Completar Perfil'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
