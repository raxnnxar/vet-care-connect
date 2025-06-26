
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Stethoscope, Pill, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface MedicalHistoryDetail {
  event_id: string;
  event_date: string;
  diagnosis: string;
  vet_name: string;
  note_text?: string;
  instructions_for_owner?: string;
  meds_summary?: string;
  pet_id: string;
  vet_id: string;
}

const MedicalHistoryDetailScreen: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [historyDetail, setHistoryDetail] = useState<MedicalHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      
      setIsLoading(true);
      try {
        // Fetch medical history detail from v_medical_history
        const { data: historyData, error: historyError } = await supabase
          .from('v_medical_history')
          .select('*')
          .eq('event_id', eventId)
          .maybeSingle();

        if (historyError) {
          console.error('Error fetching history detail:', historyError);
        } else if (historyData) {
          setHistoryDetail(historyData as MedicalHistoryDetail);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMedicationsList = (medsText: string) => {
    const meds = medsText.split('\n').filter(Boolean);
    return meds;
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

        {/* Instructions for Owner */}
        {historyDetail.instructions_for_owner && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-[#79D0B8]" />
              <h3 className="font-semibold text-gray-800">Instrucciones para el dueño</h3>
            </div>
            <p className="text-gray-700">{historyDetail.instructions_for_owner}</p>
          </Card>
        )}

        {/* Medications Summary */}
        {historyDetail.meds_summary && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-[#79D0B8]" />
              <h3 className="font-semibold text-gray-800">Medicamentos prescritos</h3>
            </div>
            <div className="space-y-2">
              {formatMedicationsList(historyDetail.meds_summary).map((medication, index) => (
                <div key={index} className="flex items-start gap-2 py-1">
                  <span className="text-[#79D0B8] mt-1 text-sm font-bold">•</span>
                  <span className="text-gray-700 whitespace-pre-line flex-1">{medication}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </LayoutBase>
  );
};

export default MedicalHistoryDetailScreen;
