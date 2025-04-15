
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Plus, Info } from 'lucide-react';
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
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      phone: '',
      petName: '',
      petSpecies: '',
      petBreed: '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPet = (data: { petName: string, petSpecies: string, petBreed: string }) => {
    const newPet = {
      id: `pet-${Date.now()}`,
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

  const handleSubmit = async (data: FormValues) => {
    try {
      // Validate phone number (simple validation for now)
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(data.phone)) {
        toast.error('Por favor ingresa un número telefónico válido');
        return;
      }

      // Update profile with phone number and image
      await dispatch(updateProfile({
        phone: data.phone,
        profileImage,
        // In a real app, we would also save pets to the database here
      }) as any);

      // Navigate to owner dashboard after successful completion
      toast.success('¡Perfil completado exitosamente!');
      navigate('/owner');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al guardar el perfil. Por favor intenta de nuevo.');
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">Completa tu Perfil</h1>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage || undefined} alt="Foto de perfil" />
              <AvatarFallback className="bg-primary/20 text-primary-foreground">
                {user?.displayName ? getInitials(user.displayName) : 'U'}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="profile-image" 
              className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-primary/80 transition-colors"
            >
              <Camera className="h-4 w-4" />
              <input 
                id="profile-image" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">Agrega una foto de perfil</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Número de Teléfono</FormLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80 text-sm">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Mis Mascotas</Label>
                <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      className="bg-accent1 hover:bg-accent1/80 text-white"
                      size="sm"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Agregar Mascota
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Mascota</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="petName">Nombre</Label>
                        <Input 
                          id="petName"
                          {...form.register('petName')}
                          placeholder="Nombre de tu mascota"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="petSpecies">Especie</Label>
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

              <div className="bg-muted rounded-md min-h-[100px] p-4">
                {pets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p>No has agregado mascotas todavía</p>
                    <p className="text-sm">Haz clic en "Agregar Mascota"</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {pets.map((pet) => (
                      <li key={pet.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
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
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/80"
            >
              Completar Perfil
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSetupScreen;
