
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Heart, FileText, AlertTriangle, Pill } from 'lucide-react';
import { usePets } from '@/features/pets/hooks/usePets';
import { useVaccineDocuments } from '@/features/pets/hooks/useVaccineDocuments';
import { Pet } from '@/features/pets/types';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface MedicalHistory {
  id: string;
  allergies?: string;
  chronic_conditions?: string;
  current_medications?: any[];
  previous_surgeries?: any[];
  vaccines_document_url?: string;
}

const PetMedicalRecordsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPetById } = usePets();
  const { documents, isLoading: documentsLoading } = useVaccineDocuments(id || '');
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch pet data
        const petData = await getPetById(id);
        if (petData) {
          setPet(petData as unknown as Pet);
        }

        // Fetch medical history
        const { data: medicalData, error } = await supabase
          .from('pet_medical_history')
          .select('*')
          .eq('pet_id', id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching medical history:', error);
        } else if (medicalData) {
          // Convert Json types to proper arrays
          const convertedMedicalData: MedicalHistory = {
            id: medicalData.id,
            allergies: medicalData.allergies,
            chronic_conditions: medicalData.chronic_conditions,
            vaccines_document_url: medicalData.vaccines_document_url,
            current_medications: Array.isArray(medicalData.current_medications) 
              ? medicalData.current_medications 
              : medicalData.current_medications 
                ? JSON.parse(medicalData.current_medications as string)
                : [],
            previous_surgeries: Array.isArray(medicalData.previous_surgeries)
              ? medicalData.previous_surgeries
              : medicalData.previous_surgeries
                ? JSON.parse(medicalData.previous_surgeries as string)
                : []
          };
          setMedicalHistory(convertedMedicalData);
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la información médica",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, getPetById, toast]);

  const handleBack = () => {
    navigate(`/owner/pets/${id}`);
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Información médica</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </LayoutBase>
    );
  }

  if (!pet) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Información médica</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4">
          <Card className="p-4 text-center">
            <p>No se pudo encontrar la información de esta mascota.</p>
            <Button className="mt-4 bg-[#79D0B8]" onClick={() => navigate('/owner/profile')}>
              Volver al perfil
            </Button>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Información médica</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="p-4 pb-20 space-y-4">
        {/* Pet Info Header */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
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
              <h2 className="text-lg font-semibold text-gray-800">{pet.name}</h2>
              <p className="text-sm text-gray-600">{pet.species} • {pet.breed || 'Raza no especificada'}</p>
            </div>
          </div>
        </Card>

        {/* Medical Information Sections */}
        
        {/* Allergies */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Alergias</h3>
          </div>
          <p className="text-gray-600">
            {medicalHistory?.allergies || 'Sin alergias registradas'}
          </p>
        </Card>

        {/* Chronic Conditions */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-800">Enfermedades crónicas</h3>
          </div>
          <p className="text-gray-600">
            {medicalHistory?.chronic_conditions || 'Sin enfermedades crónicas registradas'}
          </p>
        </Card>

        {/* Current Medications */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">Medicamentos actuales</h3>
          </div>
          {medicalHistory?.current_medications && medicalHistory.current_medications.length > 0 ? (
            <div className="space-y-2">
              {medicalHistory.current_medications.map((medication: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-800">{medication.name}</div>
                  <div className="text-sm text-gray-600">{medication.dosage}</div>
                  {medication.frequency && (
                    <div className="text-sm text-gray-500">Frecuencia: {medication.frequency}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Sin medicamentos actuales registrados</p>
          )}
        </Card>

        {/* Previous Surgeries */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Cirugías previas</h3>
          </div>
          {medicalHistory?.previous_surgeries && medicalHistory.previous_surgeries.length > 0 ? (
            <div className="space-y-2">
              {medicalHistory.previous_surgeries.map((surgery: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="font-medium text-gray-800">{surgery.name}</div>
                  <div className="text-sm text-gray-600">
                    Fecha: {new Date(surgery.date).toLocaleDateString('es-ES')}
                  </div>
                  {surgery.notes && (
                    <div className="text-sm text-gray-500">Notas: {surgery.notes}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Sin cirugías previas registradas</p>
          )}
        </Card>

        {/* Vaccine Documents */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Documentos de vacunación</h3>
          </div>
          {documentsLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc: any) => (
                <div key={doc.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">Documento de vacunación</div>
                    <div className="text-sm text-gray-600">
                      Subido el {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
                    </div>
                    {doc.notes && (
                      <div className="text-sm text-gray-500">{doc.notes}</div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(doc.document_url, '_blank')}
                  >
                    Ver
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Sin documentos de vacunación registrados</p>
          )}
        </Card>
      </div>
    </LayoutBase>
  );
};

export default PetMedicalRecordsScreen;
