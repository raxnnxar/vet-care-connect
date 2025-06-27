
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { ArrowLeft, Calendar, User, FileText, Pill } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/frontend/shared/utils/date';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface MedicalHistoryDetail {
  event_id: string;
  event_date: string;
  diagnosis: string;
  vet_name: string;
  note_text: string;
  instructions_for_owner: string;
  meds_summary: string;
  pet_id: string;
}

const MedicalHistoryDetailScreen: React.FC = () => {
  const { id: petId, eventId } = useParams<{ id: string; eventId: string }>();
  const navigate = useNavigate();
  const [historyDetail, setHistoryDetail] = useState<MedicalHistoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoryDetail = async () => {
      if (!petId || !eventId) return;
      
      console.log('Fetching history detail for:', { petId, eventId });
      
      try {
        const { data, error } = await supabase
          .from('v_medical_history')
          .select('*')
          .eq('event_id', eventId)
          .eq('pet_id', petId)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('History detail data:', data);
        setHistoryDetail(data);
      } catch (error) {
        console.error('Error fetching medical history detail:', error);
        setError('No se pudo cargar el detalle del historial médico');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryDetail();
  }, [petId, eventId]);

  const handleBack = () => {
    navigate(`/owner/pets/${petId}/medical-records`);
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalle del historial</h1>
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

  if (error || !historyDetail) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={handleBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Detalle del historial</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontró el registro
              </h3>
              <p className="text-gray-500 mb-4">
                {error || 'El registro médico solicitado no existe o no tienes permisos para verlo.'}
              </p>
              <Button onClick={handleBack}>Volver al expediente</Button>
            </CardContent>
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
          <h1 className="text-white font-medium text-lg ml-2">Detalle del historial</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="p-4 pb-20 space-y-4">
        {/* Diagnóstico principal */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">
                {historyDetail.diagnosis || 'Consulta médica'}
              </CardTitle>
              <Badge variant="outline">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(historyDetail.event_date)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Veterinario */}
        {historyDetail.vet_name && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Veterinario
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700">Dr. {historyDetail.vet_name}</p>
            </CardContent>
          </Card>
        )}

        {/* Notas médicas */}
        {historyDetail.note_text && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Notas médicas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-700 whitespace-pre-wrap">{historyDetail.note_text}</p>
            </CardContent>
          </Card>
        )}

        {/* Instrucciones para el dueño */}
        {historyDetail.instructions_for_owner && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-600">
                Instrucciones para el cuidado
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {historyDetail.instructions_for_owner.split('\n').map((line, index) => (
                  line.trim() && (
                    <p key={index} className="text-gray-700">
                      • {line.trim()}
                    </p>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medicamentos */}
        {historyDetail.meds_summary && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-green-600">
                <Pill className="h-5 w-5 mr-2" />
                Medicamentos prescritos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {historyDetail.meds_summary.split('\n').map((line, index) => (
                  line.trim() && (
                    <p key={index} className="text-gray-700">
                      • {line.trim()}
                    </p>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </LayoutBase>
  );
};

export default MedicalHistoryDetailScreen;
