
import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useSelector } from 'react-redux';
import { Button } from '@/ui/atoms/button';
import { Avatar } from '@/ui/atoms/avatar';
import { Pencil, User } from 'lucide-react';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { profileImageService } from '@/features/auth/api/profileImageService';
import PetForm from '@/features/pets/components/PetForm';
import { usePets } from '@/features/pets/hooks';
import PetListItem from '@/features/pets/components/PetListItem';
import PetDetailModal from '@/features/pets/components/PetDetailModal';
import { Pet } from '@/features/pets/types';

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
          } else {
            console.log('No pets found or invalid response format', petsResult);
            setUserPets([]);
          }
        } catch (error) {
          console.error('Error fetching pets:', error);
          setUserPets([]);
        }
      }
    };

    fetchUserDetails();
  }, [user, getCurrentUserPets]);

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      const uploadedUrl = await profileImageService.uploadProfileImage(user.id, file);
      if (uploadedUrl) {
        setUserDetails(prev => ({ ...prev, profilePicture: uploadedUrl }));
        toast.success('Imagen de perfil actualizada');
      }
    }
  };

  const handleSaveChanges = async () => {
    if (user?.id) {
      const { error } = await supabase
        .from('pet_owners')
        .update({
          phone_number: editedPhone,
          address: editedAddress
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Error al guardar cambios');
      } else {
        setUserDetails(prev => ({
          ...prev,
          phone: editedPhone,
          address: editedAddress
        }));
        setIsEditing(false);
        toast.success('Cambios guardados exitosamente');
      }
    }
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setShowPetForm(true);
  };

  const handlePetFormSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      if (editingPet) {
        const updatedPet = await updatePet(editingPet.id, petData);
        if (updatedPet && updatedPet.payload) {
          const updatedPetData = updatedPet.payload as Pet;
          setUserPets(prev => prev.map(p => p.id === editingPet.id ? updatedPetData : p));
          setShowPetForm(false);
          setEditingPet(null);
          toast.success('Mascota actualizada exitosamente');
          return updatedPetData;
        }
      } else {
        const newPet = await createPet(petData);
        if (newPet) {
          const newPetData = newPet as unknown as Pet;
          setUserPets(prev => [...prev, newPetData]);
          setShowPetForm(false);
          toast.success('Mascota agregada exitosamente');
          return newPetData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error('Error al guardar la mascota');
      return null;
    }
  };

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handlePetUpdate = async (petData: any): Promise<Pet | null> => {
    try {
      if (!selectedPet) return null;
      
      // Clone the pet data to avoid modifying the original
      const petUpdateData = { ...petData };
      
      // Remove petPhotoFile from the update data as it's not a column in the database
      if (petUpdateData.petPhotoFile) {
        const photoFile = petUpdateData.petPhotoFile;
        delete petUpdateData.petPhotoFile;
        
        // Handle photo upload separately if needed
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

      // Remove medicalHistory as it needs to be handled separately
      if (petUpdateData.medicalHistory) {
        delete petUpdateData.medicalHistory;
      }
      
      console.log('Updating pet with clean data:', petUpdateData);
      const result = await updatePet(selectedPet.id, petUpdateData);
      
      if (result && result.payload) {
        const updatedPet = result.payload as Pet;
        setUserPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
        return updatedPet;
      }
      return null;
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Error al actualizar la mascota');
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
        <div className="flex flex-col items-center mb-6 bg-white rounded-lg p-6 shadow-sm relative">
          <div className="relative mb-3">
            <Avatar className="h-24 w-24">
              {userDetails.profilePicture ? (
                <img 
                  src={userDetails.profilePicture} 
                  alt={user?.displayName} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="bg-[#5FBFB3] flex items-center justify-center w-full h-full text-white text-2xl">
                  {user?.displayName?.charAt(0) || <User size={36} />}
                </div>
              )}
            </Avatar>
            <label 
              htmlFor="profile-image-upload" 
              className="absolute bottom-0 right-0 bg-[#5FBFB3] text-white rounded-full p-2 cursor-pointer"
            >
              <Pencil size={16} />
              <input 
                type="file" 
                id="profile-image-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={handleProfileImageUpload}
              />
            </label>
          </div>
          <h2 className="text-xl font-semibold">{user?.displayName || "Usuario"}</h2>
          <p className="text-gray-500">Dueño de mascota</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Información de contacto</h3>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={20} />
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-medium">Correo electrónico:</span>
              <span>{user?.email || "No disponible"}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-medium">Teléfono:</span>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <span>{userDetails.phone || "No disponible"}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-medium">Dirección:</span>
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedAddress}
                  onChange={(e) => setEditedAddress(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <span>{userDetails.address || "No disponible"}</span>
              )}
            </div>

            {isEditing && (
              <div className="flex justify-end mt-2">
                <Button 
                  variant="default" 
                  onClick={handleSaveChanges}
                >
                  Guardar cambios
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-medium mb-4">Mis Mascotas</h3>
          
          {userPets.length > 0 ? (
            <div className="grid gap-4">
              {userPets.map(pet => (
                <PetListItem 
                  key={pet.id} 
                  pet={pet}
                  onClick={handlePetClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No tienes mascotas registradas</p>
          )}

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => {
              setEditingPet(null);
              setShowPetForm(true);
            }}
          >
            Añadir mascota
          </Button>
        </div>
      </div>

      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          isOpen={!!selectedPet}
          onClose={() => setSelectedPet(null)}
          onPetUpdate={handlePetUpdate}
        />
      )}

      {showPetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg transform transition-all animate-scale-in">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingPet ? 'Editar mascota' : 'Agregar mascota'}
              </h2>
              <PetForm
                mode={editingPet ? 'edit' : 'create'}
                pet={editingPet}
                onSubmit={handlePetFormSubmit}
                isSubmitting={false}
                onCancel={() => {
                  setShowPetForm(false);
                  setEditingPet(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </LayoutBase>
  );
};

export default OwnerProfileScreen;
