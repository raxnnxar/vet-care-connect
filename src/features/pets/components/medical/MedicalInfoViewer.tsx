import React, { useEffect, useState } from 'react';
import { Pet } from '../../types';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Heart, AlertTriangle } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { useVaccineDocuments } from '../../hooks/useVaccineDocuments';
import VaccineDocumentsList from './VaccineDocumentsList';

interface MedicalHistory {
  id: string;
  pet_id: string;
  previous_surgeries: { type: string; date: string; }[];
  allergies: string;
  chronic_conditions: string;
  created_at: string;
}

interface MedicalInfoViewerProps {
  pet: Pet;
}

const MedicalInfoViewer: React.FC<MedicalInfoViewerProps> = ({ pet }) => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const vaccineHook = useVaccineDocuments(pet.id);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('pet_medical_history')
          .select('*')
          .eq('pet_id', pet.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching medical history:', error);
          return;
        }

        if (data) {
          // Safely parse JSON fields
          const parsedData: MedicalHistory = {
            ...data,
            previous_surgeries: Array.isArray(data.previous_surgeries)
              ? data.previous_surgeries as { type: string; date: string; }[]
              : []
          };
          setMedicalHistory(parsedData);
        }
      } catch (error) {
        console.error('Error fetching medical history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [pet.id]);

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

  if (!medicalHistory && vaccineHook.documents.length === 0) {
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

      {medicalHistory && (
        <>
          {/* Previous Surgeries Section */}
          {medicalHistory.previous_surgeries.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-[#79D0B8]" />
                <h4 className="font-medium text-gray-800">Cirugías Previas</h4>
              </div>
              <div className="space-y-3">
                {medicalHistory.previous_surgeries.map((surgery, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="font-medium text-gray-800">{surgery.type}</div>
                    <div className="text-sm text-gray-600">
                      Fecha: {surgery.date}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Allergies Section */}
          {medicalHistory.allergies && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h4 className="font-medium text-gray-800">Alergias</h4>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <p className="text-gray-800">{medicalHistory.allergies}</p>
              </div>
            </Card>
          )}

          {/* Chronic Conditions Section */}
          {medicalHistory.chronic_conditions && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-red-500" />
                <h4 className="font-medium text-gray-800">Condiciones Crónicas</h4>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-gray-800">{medicalHistory.chronic_conditions}</p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MedicalInfoViewer;
