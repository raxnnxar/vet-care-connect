
import React from 'react';
import { Pet } from '../../types';
import { FileText, Heart } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { useVaccineDocuments } from '../../hooks/useVaccineDocuments';
import { usePetAllergies } from '../../hooks/usePetAllergies';
import { usePetChronicConditions } from '../../hooks/usePetChronicConditions';
import { usePetSurgeries } from '../../hooks/usePetSurgeries';
import VaccineDocumentsList from './VaccineDocumentsList';
import AllergyChip from './AllergyChip';
import ChronicConditionChip from './ChronicConditionChip';

interface MedicalInfoViewerProps {
  pet: Pet;
}

const MedicalInfoViewer: React.FC<MedicalInfoViewerProps> = ({ pet }) => {
  const vaccineHook = useVaccineDocuments(pet.id);
  const { allergies, isLoading: allergiesLoading } = usePetAllergies(pet.id);
  const { conditions, isLoading: conditionsLoading } = usePetChronicConditions(pet.id);
  const { surgeries, isLoading: surgeriesLoading } = usePetSurgeries(pet.id);

  const isLoading = allergiesLoading || conditionsLoading || surgeriesLoading;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const hasAnyMedicalInfo = vaccineHook.documents.length > 0 || allergies.length > 0 || conditions.length > 0 || surgeries.length > 0;

  if (!hasAnyMedicalInfo) {
    return (
      <div className="p-6 text-center">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg mb-2">
          Aún no hay información médica registrada para {pet.name}
        </p>
        <p className="text-gray-400 text-sm">
          La información médica se puede agregar al crear o editar la mascota
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Información Médica de {pet.name}
      </h3>

      {/* Vaccine Documents Section */}
      {vaccineHook.documents.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-[#79D0B8]" />
            <h4 className="font-medium text-gray-800">Documentos de Vacunas</h4>
          </div>
          <VaccineDocumentsList 
            petId={pet.id}
            petOwnerId={pet.owner_id}
          />
        </Card>
      )}

      {/* Allergies Section */}
      {allergies.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-red-500" />
            <h4 className="font-medium text-gray-800">Alergias</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy) => (
              <AllergyChip
                key={allergy.id}
                allergy={allergy}
                onClick={() => {}} // Read-only in this view
              />
            ))}
          </div>
        </Card>
      )}

      {/* Chronic Conditions Section */}
      {conditions.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-orange-500" />
            <h4 className="font-medium text-gray-800">Condiciones Crónicas</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <ChronicConditionChip
                key={condition.id}
                condition={condition}
                onClick={() => {}} // Read-only in this view
              />
            ))}
          </div>
        </Card>
      )}

      {/* Previous Surgeries Section */}
      {surgeries.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-5 w-5 text-[#79D0B8]" />
            <h4 className="font-medium text-gray-800">Cirugías Previas</h4>
          </div>
          <div className="space-y-3">
            {surgeries.map((surgery) => (
              <div key={surgery.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-800">{surgery.procedure}</div>
                {surgery.surgery_date && (
                  <div className="text-sm text-gray-600">
                    Fecha: {surgery.surgery_date}
                  </div>
                )}
                {surgery.notes && (
                  <div className="text-sm text-gray-600 mt-1">
                    {surgery.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MedicalInfoViewer;
