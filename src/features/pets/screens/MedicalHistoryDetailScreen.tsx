
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Stethoscope, Pill } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { Badge } from '@/ui/atoms/badge';

interface MedicalHistoryDetail {
  event_id: string;
  event_date: string;
  diagnosis: string;
  vet_name: string;
  note_text?: string;
  meds_summary?: string;
  pet_id: string;
  vet_id: string;
}

interface TreatmentMedication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  duration_days: number;
  instructions?: string;
  is_active: boolean;
}

const MedicalHistoryDetailScreen: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [historyDetail, setHistoryDetail] = useState<MedicalHistoryDetail | null>(null);
  const [medications, setMedications] = useState<TreatmentMedication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      
      setIsLoading(true);
      try {
        // Fetch medical history detail
        const { data: historyData, error: historyError } = await supabase
          .from('v_medical_history_compact')
          .select('*')
          .eq('event_id', eventId)
          .maybeSingle();

        if (historyError) {
          console.error('Error fetching history detail:', historyError);
        } else if (historyData) {
          setHistoryDetail(historyData as MedicalHistoryDetail);
        }

        // Fetch treatment medications
        const { data: medicationsData, error: medicationsError } = await supabase
          .from('treatment_medications')
          .select(`
            id,
            medication,
            dosage,
            frequency_hours,
            duration_days,
            instructions,
            treatment_cases!inner (
              id,
              appointment_id
            )
          `)
          .or(`treatment_cases.appointment_id.eq.${eventId},treatment_cases.id.eq.${eventId}`);

        if (medicationsError) {
          console.error('Error fetching medications:', medicationsError);
        } else if (medicationsData) {
          // Check active status for each medication
          const medicationsWithStatus = await Promise.all(
            medicationsData.map(async (med) => {
              const { data: activeData } = await supabase
                .from('v_treatment_medications')
                .select('is_active')
                .eq('id', med.id)
                .single();

              return {
                id: med.id,
                medication: med.medication,
                dosage: med.dosage,
                frequency_hours: med.frequency_hours,
                duration_days: med.duration_days,
                instructions: med.instructions,
                is_active: activeData?.is_active || false
              };
            })
          );
          
          setMedications(medicationsWithStatus);
        }
      } catch (error) {
        console.error('Error fetching detail data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatFrequency = (hours: number) => {
    if (hours === 24) return 'c/24h';
    if (hours === 12) return 'c/12h';
    if (hours === 8) return 'c/8h';
    if (hours === 6) return 'c/6h';
    return `c/${hours}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalle de historial</h1>
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

  if (!historyDetail) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalle de historial</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4">
          <Card className="p-4 text-center">
            <p>No se pudo encontrar el detalle de este evento médico.</p>
            <Button className="mt-4 bg-[#79D0B8]" onClick={handleBack}>
              Volver
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
          <h1 className="text-white font-medium text-lg ml-2">Detalle de historial</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="p-4 pb-20 space-y-6">
        {/* Header Info */}
        <Card className="p-4">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              {formatDate(historyDetail.event_date)}
            </h2>
            <p className="text-gray-600">Vet: {historyDetail.vet_name}</p>
          </div>
        </Card>

        {/* Diagnosis */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Stethoscope className="w-5 h-5 text-[#79D0B8]" />
            <h3 className="font-semibold text-gray-800">Diagnóstico</h3>
          </div>
          <p className="text-gray-700">{historyDetail.diagnosis}</p>
        </Card>

        {/* Clinical Note */}
        {historyDetail.note_text && (
          <Card className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Nota clínica</h3>
            <p className="text-gray-700">{historyDetail.note_text}</p>
          </Card>
        )}

        {/* Medications */}
        {medications.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-[#79D0B8]" />
              <h3 className="font-semibold text-gray-800">Medicamentos prescritos</h3>
            </div>
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{med.medication}</span>
                      <Badge variant={med.is_active ? "default" : "secondary"}>
                        {med.is_active ? "Activo" : "Finalizado"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {med.dosage} {formatFrequency(med.frequency_hours)} ({med.duration_days} días)
                    </p>
                    {med.instructions && (
                      <p className="text-sm text-gray-500 mt-1">{med.instructions}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Back Button */}
        <Button 
          onClick={handleBack}
          className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
        >
          Volver
        </Button>
      </div>
    </LayoutBase>
  );
};

export default MedicalHistoryDetailScreen;
