
import React, { useState } from 'react';
import { ChevronLeft, Pencil, X } from 'lucide-react';
import { Pet } from '../types';
import { Button } from '@/ui/atoms/button';
import { Avatar } from '@/ui/atoms/avatar';
import PetForm from './PetForm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface PetDetailModalProps {
  pet: Pet;
  isOpen: boolean;
  onClose: () => void;
  onPetUpdate: (updatedPet: Pet) => Promise<Pet | null>;
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({ 
  pet, 
  isOpen, 
  onClose,
  onPetUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPet, setCurrentPet] = useState<Pet>(pet);

  if (!isOpen) return null;

  const handlePetUpdate = async (updatedPetData: any): Promise<Pet | null> => {
    try {
      console.log('Sending pet update with data:', updatedPetData);
      const result = await onPetUpdate(updatedPetData);
      if (result) {
        toast.success('Mascota actualizada exitosamente');
        setIsEditing(false);
        setCurrentPet(result);
      }
      return result;
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Error al actualizar la mascota');
      return null;
    }
  };

  const calculateAge = (dateOfBirth: string | undefined) => {
    if (!dateOfBirth) return 'No especificada';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return `${age} años`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto">
      <div className="relative bg-white w-full max-w-2xl min-h-[50vh] mt-20 rounded-lg shadow-lg animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="absolute left-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h2 className="text-lg font-semibold text-center flex-1">
            Detalles de la Mascota
          </h2>

          {!isEditing && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsEditing(true)}
              className="absolute right-2"
            >
              <Pencil className="h-5 w-5" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="p-4">
            <PetForm
              mode="edit"
              pet={currentPet}
              onSubmit={handlePetUpdate}
              isSubmitting={false}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-2 border-primary/20">
                {currentPet.profile_picture_url ? (
                  <img 
                    src={currentPet.profile_picture_url} 
                    alt={currentPet.name} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="bg-primary/10 w-full h-full rounded-full flex items-center justify-center">
                    <span className="text-4xl text-primary/50">
                      {currentPet.name[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </Avatar>
              <h3 className="text-2xl font-semibold text-gray-900">{currentPet.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Especie</p>
                <p className="text-base font-medium">{currentPet.species}</p>
              </div>

              {currentPet.breed && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Raza</p>
                  <p className="text-base font-medium">{currentPet.breed}</p>
                </div>
              )}

              {currentPet.date_of_birth && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Edad</p>
                  <p className="text-base font-medium">
                    {calculateAge(currentPet.date_of_birth)}
                  </p>
                </div>
              )}

              {currentPet.sex && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Sexo</p>
                  <p className="text-base font-medium">{currentPet.sex}</p>
                </div>
              )}

              {currentPet.weight && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Peso</p>
                  <p className="text-base font-medium">{currentPet.weight} kg</p>
                </div>
              )}

              {currentPet.temperament && (
                <div className="space-y-2 col-span-full">
                  <p className="text-sm text-gray-500">Temperamento</p>
                  <p className="text-base font-medium">{currentPet.temperament}</p>
                </div>
              )}
            </div>

            {currentPet.additional_notes && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Notas adicionales</p>
                <p className="text-base">{currentPet.additional_notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetailModal;
