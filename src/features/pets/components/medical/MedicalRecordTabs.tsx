
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Badge } from '@/ui/atoms/badge';
import { Button } from '@/ui/atoms/button';
import { Pill, Syringe, Stethoscope, Scissors, Plus } from 'lucide-react';
import CurrentMedicationsSection from './CurrentMedicationsSection';
import VaccinationRecordSection from './VaccinationRecordSection';
import MedicalHistorySection from './MedicalHistorySection';
import SurgeriesSection from './SurgeriesSection';
import AllergyChip from './AllergyChip';
import ChronicConditionChip from './ChronicConditionChip';
import AllergyModal from './AllergyModal';
import ChronicConditionModal from './ChronicConditionModal';
import { usePetAllergies } from '@/features/pets/hooks/usePetAllergies';
import { usePetChronicConditions } from '@/features/pets/hooks/usePetChronicConditions';
import { PetAllergy, PetChronicCondition } from '@/features/pets/types/formTypes';

interface MedicalRecordTabsProps {
  petId: string;
  petOwnerId: string;
}

const MedicalRecordTabs: React.FC<MedicalRecordTabsProps> = ({ petId, petOwnerId }) => {
  const [activeMedicationsCount, setActiveMedicationsCount] = useState(0);
  const [vaccinationRecordsCount, setVaccinationRecordsCount] = useState(0);
  const [surgeriesCount, setSurgeriesCount] = useState(0);
  const [medicalHistoryCount, setMedicalHistoryCount] = useState(0);

  // Hooks para alergias y condiciones crónicas
  const { allergies, addAllergy, updateAllergy, deleteAllergy } = usePetAllergies(petId);
  const { conditions, addCondition, updateCondition, deleteCondition } = usePetChronicConditions(petId);

  // Estados para modales
  const [allergyModal, setAllergyModal] = useState<{ open: boolean; allergy?: PetAllergy | null }>({ open: false });
  const [conditionModal, setConditionModal] = useState<{ open: boolean; condition?: PetChronicCondition | null }>({ open: false });

  // Handlers para alergias
  const handleAllergyClick = (allergy: PetAllergy) => {
    setAllergyModal({ open: true, allergy });
  };

  const handleAddAllergy = () => {
    setAllergyModal({ open: true, allergy: null });
  };

  const handleSaveAllergy = async (allergen: string, notes?: string) => {
    if (allergyModal.allergy) {
      await updateAllergy(allergyModal.allergy.id, allergen, notes);
    } else {
      await addAllergy(allergen, notes);
    }
  };

  const handleDeleteAllergy = async (id: string) => {
    await deleteAllergy(id);
  };

  // Handlers para condiciones crónicas
  const handleConditionClick = (condition: PetChronicCondition) => {
    setConditionModal({ open: true, condition });
  };

  const handleAddCondition = () => {
    setConditionModal({ open: true, condition: null });
  };

  const handleSaveCondition = async (conditionName: string, notes?: string) => {
    if (conditionModal.condition) {
      await updateCondition(conditionModal.condition.id, conditionName, notes);
    } else {
      await addCondition(conditionName, notes);
    }
  };

  const handleDeleteCondition = async (id: string) => {
    await deleteCondition(id);
  };

  // Render chips con máximo 3 + botón "más"
  const renderAllergyChips = () => {
    const displayAllergies = allergies.slice(0, 3);
    const hasMore = allergies.length > 3;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {displayAllergies.map((allergy) => (
          <AllergyChip
            key={allergy.id}
            allergy={allergy}
            onClick={handleAllergyClick}
          />
        ))}
        {hasMore && (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-red-100 text-red-600 bg-red-50"
          >
            +{allergies.length - 3} más
          </Badge>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAddAllergy}
          className="h-6 w-6 p-0 rounded-full hover:bg-red-100"
        >
          <Plus className="h-3 w-3 text-red-600" />
        </Button>
      </div>
    );
  };

  const renderConditionChips = () => {
    const displayConditions = conditions.slice(0, 3);
    const hasMore = conditions.length > 3;

    return (
      <div className="flex flex-wrap gap-2 items-center">
        {displayConditions.map((condition) => (
          <ChronicConditionChip
            key={condition.id}
            condition={condition}
            onClick={handleConditionClick}
          />
        ))}
        {hasMore && (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-orange-100 text-orange-600 bg-orange-50"
          >
            +{conditions.length - 3} más
          </Badge>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleAddCondition}
          className="h-6 w-6 p-0 rounded-full hover:bg-orange-100"
        >
          <Plus className="h-3 w-3 text-orange-600" />
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Cabecera con chips de alergias y condiciones crónicas */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Alergias</h4>
          {allergies.length > 0 ? (
            renderAllergyChips()
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sin alergias registradas</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAddAllergy}
                className="h-6 w-6 p-0 rounded-full hover:bg-red-100"
              >
                <Plus className="h-3 w-3 text-red-600" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Condiciones Crónicas</h4>
          {conditions.length > 0 ? (
            renderConditionChips()
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sin condiciones crónicas registradas</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAddCondition}
                className="h-6 w-6 p-0 rounded-full hover:bg-orange-100"
              >
                <Plus className="h-3 w-3 text-orange-600" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="w-4 h-4" />
            <span className="hidden sm:inline">Medicamentos</span>
            {activeMedicationsCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeMedicationsCount}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="vaccination" className="flex items-center gap-2">
            <Syringe className="w-4 h-4" />
            <span className="hidden sm:inline">Vacunas</span>
            {vaccinationRecordsCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {vaccinationRecordsCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="surgeries" className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            <span className="hidden sm:inline">Cirugías</span>
            {surgeriesCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {surgeriesCount}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            <span className="hidden sm:inline">Historial</span>
            {medicalHistoryCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {medicalHistoryCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-6">
          <CurrentMedicationsSection 
            petId={petId} 
            petOwnerId={petOwnerId}
            onCountChange={setActiveMedicationsCount}
          />
        </TabsContent>

        <TabsContent value="vaccination" className="space-y-6">
          <VaccinationRecordSection 
            petId={petId}
            onCountChange={setVaccinationRecordsCount}
          />
        </TabsContent>

        <TabsContent value="surgeries" className="space-y-6">
          <SurgeriesSection 
            petId={petId}
            onCountChange={setSurgeriesCount}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <MedicalHistorySection 
            petId={petId}
            onCountChange={setMedicalHistoryCount}
          />
        </TabsContent>
      </Tabs>

      {/* Modales */}
      <AllergyModal
        open={allergyModal.open}
        onOpenChange={(open) => setAllergyModal({ ...allergyModal, open })}
        onSave={handleSaveAllergy}
        allergy={allergyModal.allergy}
        title={allergyModal.allergy ? 'Editar Alergia' : 'Añadir Alergia'}
      />

      <ChronicConditionModal
        open={conditionModal.open}
        onOpenChange={(open) => setConditionModal({ ...conditionModal, open })}
        onSave={handleSaveCondition}
        condition={conditionModal.condition}
        title={conditionModal.condition ? 'Editar Condición Crónica' : 'Añadir Condición Crónica'}
      />
    </div>
  );
};

export default MedicalRecordTabs;
