
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, AlertTriangle, Play } from 'lucide-react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Badge } from '@/ui/atoms/badge';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/molecules/dialog';

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
  first_dose_at: string | null;
  is_active: boolean | null;
  next_dose_at: string | null;
  days_left: number | null;
}

interface Treatment {
  id: string;
  pet_id: string;
  diagnosis: string;
  instructions_for_owner: string | null;
  start_date: string;
  pet_name: string;
  medications: TreatmentMedication[];
}

const TreatmentsScreen = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingDose, setIsStartingDose] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);

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

      // Get treatment case IDs
      const treatmentCaseIds = treatmentCases.map(tc => tc.id);

      // Fetch medications from the view, excluding inactive ones
      const { data: medications, error: medicationError } = await supabase
        .from('v_treatment_medications')
        .select('*')
        .in('treatment_case_id', treatmentCaseIds)
        .or('first_dose_at.is.null,is_active.eq.true'); // Only pending or active

      if (medicationError) {
        console.error('Error fetching medications:', medicationError);
        toast.error('Error al cargar los medicamentos');
        return;
      }

      // Group medications by treatment case
      const treatmentsWithMedications = treatmentCases.map(treatment => {
        const treatmentMedications = medications?.filter(med => 
          med.treatment_case_id === treatment.id
        ) || [];

        return {
          id: treatment.id,
          pet_id: treatment.pet_id,
          diagnosis: treatment.diagnosis,
          instructions_for_owner: treatment.instructions_for_owner,
          start_date: treatment.start_date,
          pet_name: (treatment.pets as any).name,
          medications: treatmentMedications as TreatmentMedication[]
        };
      }).filter(treatment => treatment.medications.length > 0); // Only treatments with medications

      setTreatments(treatmentsWithMedications);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los tratamientos');
    } finally {
      setIsLoading(false);
    }
  };

  const startDoseNow = async (medicationId: string) => {
    setIsStartingDose(medicationId);
    try {
      const { error } = await supabase
        .from('treatment_medications')
        .update({ first_dose_at: new Date().toISOString() })
        .eq('id', medicationId);

      if (error) {
        console.error('Error starting dose:', error);
        toast.error('Error al iniciar la dosis');
        return;
      }

      toast.success('Primera dosis iniciada');
      await fetchActiveTreatments(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al iniciar la dosis');
    } finally {
      setIsStartingDose(null);
    }
  };

  const startDoseAtTime = async () => {
    if (!selectedMedicationId || !selectedTime) return;

    try {
      // Create a date with today's date and selected time
      const today = new Date();
      const [hours, minutes] = selectedTime.split(':');
      const selectedDateTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));

      const { error } = await supabase
        .from('treatment_medications')
        .update({ first_dose_at: selectedDateTime.toISOString() })
        .eq('id', selectedMedicationId);

      if (error) {
        console.error('Error starting dose at time:', error);
        toast.error('Error al programar la dosis');
        return;
      }

      toast.success('Primera dosis programada');
      setIsTimeDialogOpen(false);
      setSelectedTime('');
      setSelectedMedicationId(null);
      await fetchActiveTreatments(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al programar la dosis');
    }
  };

  const openTimeDialog = (medicationId: string) => {
    setSelectedMedicationId(medicationId);
    setSelectedTime(new Date().toTimeString().slice(0, 5)); // Default to current time
    setIsTimeDialogOpen(true);
  };

  const getMedicationStatus = (medication: TreatmentMedication) => {
    if (!medication.first_dose_at) return 'pending';
    if (medication.is_active) return 'active';
    return 'finished';
  };

  const formatFrequency = (hours: number) => {
    if (hours === 24) return 'Una vez al día';
    if (hours === 12) return 'Cada 12 horas';
    if (hours === 8) return 'Cada 8 horas';
    if (hours === 6) return 'Cada 6 horas';
    return `Cada ${hours} horas`;
  };

  const formatNextDose = (nextDoseAt: string | null) => {
    if (!nextDoseAt) return null;
    
    const nextDose = new Date(nextDoseAt);
    const today = new Date();
    const isToday = nextDose.toDateString() === today.toDateString();
    
    const timeString = nextDose.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (isToday) {
      return `Hoy a las ${timeString}`;
    } else {
      const dateString = nextDose.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      return `${dateString} a las ${timeString}`;
    }
  };

  const handleBackClick = () => {
    navigate('/owner');
  };

  const handleViewHistory = () => {
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
                No tienes tratamientos activos
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
                  {treatment.medications.map((medication) => {
                    const status = getMedicationStatus(medication);
                    
                    return (
                      <div key={medication.id} className={`p-3 rounded-lg ${
                        status === 'pending' ? 'bg-gray-50 border border-orange-200' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-800">{medication.medication}</h5>
                          {status === 'active' && (
                            <Badge variant="outline" className="text-[#79D0B8] border-[#79D0B8]">
                              Activo
                            </Badge>
                          )}
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

                        {status === 'pending' && (
                          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span className="text-sm font-medium text-orange-700">
                                Aún no has iniciado la primera dosis
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                onClick={() => startDoseNow(medication.id)}
                                disabled={isStartingDose === medication.id}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                {isStartingDose === medication.id ? 'Iniciando...' : 'Iniciar ahora'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                onClick={() => openTimeDialog(medication.id)}
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Elegir hora
                              </Button>
                            </div>
                          </div>
                        )}

                        {status === 'active' && (
                          <div className="mt-2 space-y-1">
                            {medication.next_dose_at && (
                              <div className="flex items-center gap-1 text-sm text-[#79D0B8] font-medium">
                                <Clock className="w-4 h-4" />
                                <span>Próxima dosis: {formatNextDose(medication.next_dose_at)}</span>
                              </div>
                            )}
                            {medication.days_left !== null && (
                              <p className="text-sm text-gray-600">
                                {medication.days_left > 0 
                                  ? `Quedan: ${medication.days_left} días`
                                  : 'Uso indefinido'
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
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

        {/* Time Picker Dialog */}
        <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Elegir hora para la primera dosis</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsTimeDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={startDoseAtTime}
                  disabled={!selectedTime}
                >
                  Programar dosis
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </LayoutBase>
  );
};

export default TreatmentsScreen;
