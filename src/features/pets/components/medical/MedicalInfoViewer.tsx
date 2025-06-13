
import React, { useState, useEffect } from 'react';
import { Pet } from '../../types';
import { Card } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { Syringe, FileText, AlertTriangle, Scissors } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useVaccineDocuments } from '../../hooks/useVaccineDocuments';

interface MedicalInfoViewerProps {
  pet: Pet;
}

interface MedicalHistory {
  current_medications?: Array<{ name: string; dosage: string; frequency: string }>;
  previous_surgeries?: Array<{ type: string; date: string }>;
  allergies?: string;
  chronic_conditions?: string;
}

const MedicalInfoViewer: React.FC<MedicalInfoViewerProps> = ({ pet }) => {
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { documents: vaccineDocuments, isLoading: documentsLoading } = useVaccineDocuments(pet.id);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('pet_medical_history')
          .select('*')
          .eq('pet_id', pet.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching medical history:', error);
          return;
        }

        if (data) {
          // Safely parse JSON fields
          const parsedHistory: MedicalHistory = {
            current_medications: Array.isArray(data.current_medications) 
              ? data.current_medications as Array<{ name: string; dosage: string; frequency: string }>
              : [],
            previous_surgeries: Array.isArray(data.previous_surgeries)
              ? data.previous_surgeries as Array<{ type: string; date: string }>
              : [],
            allergies: data.allergies || undefined,
            chronic_conditions: data.chronic_conditions || undefined,
          };
          setMedicalHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Error fetching medical history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [pet.id]);

  if (isLoading || documentsLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const hasAnyMedicalData = medicalHistory || (vaccineDocuments && vaccineDocuments.length > 0);

  if (!hasAnyMedicalData) {
    return (
      <div className="text-center py-8">
        <div className="mb-4">
          <Syringe className="w-12 h-12 text-gray-300 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          Sin información médica
        </h3>
        <p className="text-gray-500">
          Aún no hay información médica registrada para {pet.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vaccine Documents */}
      {vaccineDocuments && vaccineDocuments.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-[#79D0B8]" />
            <h4 className="font-medium">Documentos de vacunas</h4>
          </div>
          <div className="space-y-2">
            {vaccineDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium">Documento de vacuna</p>
                  {doc.notes && <p className="text-xs text-gray-600">{doc.notes}</p>}
                  <p className="text-xs text-gray-500">
                    Subido el {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <a 
                  href={doc.document_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#79D0B8] text-sm hover:underline"
                >
                  Ver documento
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Current Medications */}
      {medicalHistory?.current_medications && medicalHistory.current_medications.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Syringe className="w-5 h-5 text-[#79D0B8]" />
            <h4 className="font-medium">Medicamentos actuales</h4>
          </div>
          <div className="space-y-2">
            {medicalHistory.current_medications.map((medication, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <p className="font-medium">{medication.name}</p>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span>Dosis: {medication.dosage}</span>
                  <span>Frecuencia: {medication.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Allergies */}
      {medicalHistory?.allergies && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h4 className="font-medium">Alergias</h4>
          </div>
          <p className="text-gray-700">{medicalHistory.allergies}</p>
        </Card>
      )}

      {/* Chronic Conditions */}
      {medicalHistory?.chronic_conditions && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h4 className="font-medium">Condiciones crónicas</h4>
          </div>
          <p className="text-gray-700">{medicalHistory.chronic_conditions}</p>
        </Card>
      )}

      {/* Previous Surgeries */}
      {medicalHistory?.previous_surgeries && medicalHistory.previous_surgeries.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Scissors className="w-5 h-5 text-[#79D0B8]" />
            <h4 className="font-medium">Cirugías previas</h4>
          </div>
          <div className="space-y-2">
            {medicalHistory.previous_surgeries.map((surgery, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <p className="font-medium">{surgery.type}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Fecha: {surgery.date ? new Date(surgery.date).toLocaleDateString() : 'No especificada'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MedicalInfoViewer;
