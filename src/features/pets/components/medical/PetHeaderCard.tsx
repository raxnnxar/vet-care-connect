
import React, { useState } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Plus } from 'lucide-react';
import { Pet } from '../../types';
import { usePetAllergies } from '../../hooks/usePetAllergies';
import { usePetChronicConditions } from '../../hooks/usePetChronicConditions';
import AllergyChip from './AllergyChip';
import ChronicConditionChip from './ChronicConditionChip';
import AllergyModal from './AllergyModal';
import ChronicConditionModal from './ChronicConditionModal';
import { PetAllergy, PetChronicCondition } from '../../types/formTypes';

interface PetHeaderCardProps {
  pet: Pet;
}

const PetHeaderCard: React.FC<PetHeaderCardProps> = ({ pet }) => {
  const { allergies, addAllergy, updateAllergy, deleteAllergy } = usePetAllergies(pet.id);
  const { conditions, addCondition, updateCondition, deleteCondition } = usePetChronicConditions(pet.id);
  
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<PetAllergy | null>(null);
  const [editingCondition, setEditingCondition] = useState<PetChronicCondition | null>(null);

  const displayedAllergies = allergies.slice(0, 3);
  const remainingAllergiesCount = Math.max(0, allergies.length - 3);
  
  const displayedConditions = conditions.slice(0, 3);
  const remainingConditionsCount = Math.max(0, conditions.length - 3);

  const handleAllergyClick = (allergy: PetAllergy) => {
    setEditingAllergy(allergy);
    setAllergyModalOpen(true);
  };

  const handleConditionClick = (condition: PetChronicCondition) => {
    setEditingCondition(condition);
    setConditionModalOpen(true);
  };

  const handleAddAllergy = () => {
    setEditingAllergy(null);
    setAllergyModalOpen(true);
  };

  const handleAddCondition = () => {
    setEditingCondition(null);
    setConditionModalOpen(true);
  };

  const handleSaveAllergy = async (allergen: string, notes?: string) => {
    if (editingAllergy) {
      await updateAllergy(editingAllergy.id, allergen, notes);
    } else {
      await addAllergy(allergen, notes);
    }
  };

  const handleSaveCondition = async (condition: string, notes?: string) => {
    if (editingCondition) {
      await updateCondition(editingCondition.id, condition, notes);
    } else {
      await addCondition(condition, notes);
    }
  };

  return (
    <>
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#79D0B8] rounded-full flex items-center justify-center overflow-hidden">
            {pet.profile_picture_url ? (
              <img 
                src={pet.profile_picture_url} 
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {pet.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{pet.name}</h2>
            <p className="text-sm text-gray-600">{pet.species} • {pet.breed || 'Raza no especificada'}</p>
          </div>
        </div>

        {/* Alergias */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Alergias:</span>
            {displayedAllergies.length > 0 ? (
              <>
                {displayedAllergies.map((allergy) => (
                  <AllergyChip
                    key={allergy.id}
                    allergy={allergy}
                    onClick={handleAllergyClick}
                    onDelete={deleteAllergy}
                    showDelete={true}
                  />
                ))}
                {remainingAllergiesCount > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    +{remainingAllergiesCount} más
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-400">Sin alergias registradas</span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddAllergy}
              className="bg-green-100 text-green-600 hover:bg-green-200 rounded-full px-2 py-0.5 text-sm h-auto"
            >
              <Plus className="h-3 w-3 mr-1" />
              Añadir
            </Button>
          </div>
        </div>

        {/* Condiciones Crónicas */}
        <div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Condiciones crónicas:</span>
            {displayedConditions.length > 0 ? (
              <>
                {displayedConditions.map((condition) => (
                  <ChronicConditionChip
                    key={condition.id}
                    condition={condition}
                    onClick={handleConditionClick}
                    onDelete={deleteCondition}
                    showDelete={true}
                  />
                ))}
                {remainingConditionsCount > 0 && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    +{remainingConditionsCount} más
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-400">Sin condiciones crónicas</span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddCondition}
              className="bg-green-100 text-green-600 hover:bg-green-200 rounded-full px-2 py-0.5 text-sm h-auto"
            >
              <Plus className="h-3 w-3 mr-1" />
              Añadir
            </Button>
          </div>
        </div>
      </Card>

      {/* Modales */}
      <AllergyModal
        open={allergyModalOpen}
        onOpenChange={setAllergyModalOpen}
        onSave={handleSaveAllergy}
        allergy={editingAllergy}
        title={editingAllergy ? 'Editar Alergia' : 'Añadir Alergia'}
      />

      <ChronicConditionModal
        open={conditionModalOpen}
        onOpenChange={setConditionModalOpen}
        onSave={handleSaveCondition}
        condition={editingCondition}
        title={editingCondition ? 'Editar Condición' : 'Añadir Condición'}
      />
    </>
  );
};

export default PetHeaderCard;
