
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Badge } from '@/ui/atoms/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface Treatment {
  id: string;
  pet_id: string;
  diagnosis: string;
  instructions_for_owner: string | null;
  start_date: string;
  pet_name: string;
  medications: TreatmentMedication[];
}

interface TreatmentMedication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  duration_days: number;
  start_date: string;
  instructions: string | null;
  created_at: string | null;
  treatment_case_id: string;
}

const TreatmentsScreen = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveTreatments();
  }, [user]);

  const fetchActiveTreatments = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Fetch treatment cases for the user's pets
      const { data: treatmentCases, error: treatmentError } = await supabase
        .from('treatment_cases')
        .select(`
          id,
          pet_id,
          diagnosis,
          instructions_for_owner,
          start_date,
          pets!inner(
            name,
            owner_id
          )
        `)
        .eq('pets.owner_id', user.id);

      if (treatmentError) {
        console.error('Error fetching treatments:', treatmentError);
        toast.error('Error al cargar los tratamientos');
        return;
      }

      if (!treatmentCases || treatmentCases.length === 0) {
        setTreatments([]);
        return;
      }

      // Fetch medications for each treatment case
      const treatmentsWithMedications = await Promise.all(
        treatmentCases.map(async (treatment) => {
          const { data: medications, error: medicationError } = await supabase
            .from('treatment_medications')
            .select('*')
            .eq('treatment_case_id', treatment.id);

          if (medicationError) {
            console.error('Error fetching medications:', medicationError);
            return null;
          }

          // Filter active medications (within duration period)
          const activeMedications = medications?.filter(med => {
            const startDate = new Date(med.start_date);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + med.duration_days);
            return new Date() <= endDate;
          }) || [];

          return {
            id: treatment.id,
            pet_id: treatment.pet_id,
            diagnosis: treatment.diagnosis,
            instructions_for_owner: treatment.instructions_for_owner,
            start_date: treatment.start_date,
            pet_name: (treatment.pets as any).name,
            medications: activeMedications
          };
        })
      );

      // Filter out null results and treatments without active medications
      const validTreatments = treatmentsWithMedications
        .filter((treatment): treatment is Treatment => 
          treatment !== null && treatment.medications.length > 0
        );

      setTreatments(validTreatments);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tratamientos');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextDose = (medication: TreatmentMedication) => {
    const startDate = new Date(medication.start_date);
    const now = new Date();
    const frequencyMs = medication.frequency_hours * 60 * 60 * 1000;
    
    // Find the next dose time
    let nextDose = new Date(startDate);
    while (nextDose <= now) {
      nextDose = new Date(nextDose.getTime() + frequencyMs);
    }
    
    // Check if it's today
    const today = new Date();
    const isToday = nextDose.toDateString() === today.toDateString();
    
    const timeString = nextDose.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (isToday) {
      return `Siguiente dosis de ${medication.medication} a las ${timeString} de hoy`;
    } else {
      const dateString = nextDose.toLocaleDateString('es-ES');
      return `Siguiente dosis de ${medication.medication} el ${dateString} a las ${timeString}`;
    }
  };

  const formatFrequency = (hours: number) => {
    if (hours === 24) return 'Una vez al día';
    if (hours === 12) return 'Cada 12 horas';
    if (hours === 8) return 'Cada 8 horas';
    if (hours === 6) return 'Cada 6 horas';
    return `Cada ${hours} horas`;
  };

  const handleBackClick = () => {
    navigate('/owner');
  };

  const handleViewHistory = () => {
    // Por ahora no hace nada, como solicitaste
    toast.info('Funcionalidad disponible próximamente');
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center gap-3 px-4 py-3 bg-[#79D0B8]">
            <button onClick={handleBackClick} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-lg font-semibold">Tratamientos</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="home" />}
      >
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase
      header={
        <div className="flex items-center gap-3 px-4 py-3 bg-[#79D0B8]">
          <button onClick={handleBackClick} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-lg font-semibold">Tratamientos</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20 space-y-4">
        {treatments.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Sin tratamientos activos
              </h3>
              <p className="text-gray-600 mb-6">
                Tu mascota no tiene tratamientos activos en este momento.
              </p>
            </div>
            <Button
              onClick={handleViewHistory}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Ver historial de tratamientos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {treatments.map((treatment) => (
              <Card key={treatment.id} className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {treatment.pet_name}
                    </h3>
                    <Badge variant="outline" className="text-[#79D0B8] border-[#79D0B8]">
                      Activo
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Diagnóstico:</span> {treatment.diagnosis}
                  </p>
                  {treatment.instructions_for_owner && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Instrucciones:</span> {treatment.instructions_for_owner}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    💊 Medicamentos
                  </h4>
                  {treatment.medications.map((medication) => (
                    <div key={medication.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-800">{medication.medication}</h5>
                        <Badge variant="secondary" className="text-xs">
                          {medication.duration_days} días
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Dosis:</span> {medication.dosage}
                        </div>
                        <div>
                          <span className="font-medium">Frecuencia:</span> {formatFrequency(medication.frequency_hours)}
                        </div>
                      </div>
                      
                      {medication.instructions && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Instrucciones:</span> {medication.instructions}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1 text-sm text-[#79D0B8] font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{calculateNextDose(medication)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[#79D0B8] border-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
                    onClick={() => toast.info('Funcionalidad disponible próximamente')}
                  >
                    Ver detalles completos
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </LayoutBase>
  );
};

export default TreatmentsScreen;
