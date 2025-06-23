
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Plus, Pill, Calendar, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { Badge } from '@/ui/atoms/badge';
import { formatDate } from '@/frontend/shared/utils/date';
import AddMedicationDialog from './AddMedicationDialog';
import EditMedicationDialog from './EditMedicationDialog';

interface Medication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  start_date: string;
  end_date: string | null;
  is_permanent: boolean;
  source: 'owner' | 'vet';
  prescribed_by?: string;
  treatment_case_id?: string;
}

interface CurrentMedicationsSectionProps {
  petId: string;
  petOwnerId: string;
  onCountChange: (count: number) => void;
}

const CurrentMedicationsSection: React.FC<CurrentMedicationsSectionProps> = ({
  petId,
  petOwnerId,
  onCountChange
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const isOwner = user?.id === petOwnerId;

  useEffect(() => {
    fetchCurrentMedications();
  }, [petId]);

  useEffect(() => {
    onCountChange(medications.length);
  }, [medications.length, onCountChange]);

  const fetchCurrentMedications = async () => {
    setIsLoading(true);
    try {
      // Fetch owner medications
      const { data: ownerMeds, error: ownerError } = await supabase
        .from('owner_medications')
        .select('*')
        .eq('pet_id', petId)
        .or('end_date.is.null,end_date.gte.' + new Date().toISOString().split('T')[0]);

      if (ownerError) throw ownerError;

      // Fetch vet medications from active treatments
      const { data: vetMeds, error: vetError } = await supabase
        .from('treatment_medications')
        .select(`
          *,
          treatment_cases!inner(
            veterinarian_id,
            start_date,
            pet_id
          )
        `)
        .eq('treatment_cases.pet_id', petId)
        .lte('treatment_cases.start_date', new Date().toISOString().split('T')[0])
        .gte('start_date', new Date().toISOString().split('T')[0]);

      if (vetError) throw vetError;

      // Get veterinarian names for vet medications
      let vetProfiles: any[] = [];
      if (vetMeds && vetMeds.length > 0) {
        const vetIds = [...new Set(vetMeds.map(med => med.treatment_cases?.veterinarian_id).filter(Boolean))];
        if (vetIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, display_name')
            .in('id', vetIds);

          if (!profilesError && profiles) {
            vetProfiles = profiles;
          }
        }
      }

      // Transform owner medications
      const transformedOwnerMeds: Medication[] = (ownerMeds || []).map(med => ({
        id: med.id,
        medication: med.medication,
        dosage: med.dosage || '',
        frequency_hours: med.frequency_hours || 0,
        start_date: med.start_date || '',
        end_date: med.end_date,
        is_permanent: med.is_permanent || false,
        source: 'owner' as const
      }));

      // Transform vet medications
      const transformedVetMeds: Medication[] = (vetMeds || []).map(med => {
        const endDate = new Date(med.start_date);
        endDate.setDate(endDate.getDate() + med.duration_days);
        const isActive = endDate > new Date();
        
        const vetProfile = vetProfiles.find(p => p.id === med.treatment_cases?.veterinarian_id);
        
        return {
          id: med.id,
          medication: med.medication,
          dosage: med.dosage,
          frequency_hours: med.frequency_hours,
          start_date: med.start_date,
          end_date: isActive ? endDate.toISOString().split('T')[0] : null,
          is_permanent: false,
          source: 'vet' as const,
          prescribed_by: vetProfile?.display_name || 'Veterinario',
          treatment_case_id: med.treatment_case_id
        };
      }).filter(med => med.end_date === null || new Date(med.end_date) > new Date());

      setMedications([...transformedOwnerMeds, ...transformedVetMeds]);
    } catch (error) {
      console.error('Error fetching medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMedicationAdded = () => {
    fetchCurrentMedications();
    setShowAddDialog(false);
  };

  const handleMedicationUpdated = () => {
    fetchCurrentMedications();
    setEditingMedication(null);
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (!isOwner) return;
    
    try {
      const { error } = await supabase
        .from('owner_medications')
        .delete()
        .eq('id', medicationId);

      if (error) throw error;
      
      fetchCurrentMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const getFrequencyText = (hours: number) => {
    if (hours === 24) return 'Una vez al día';
    if (hours === 12) return 'Cada 12 horas';
    if (hours === 8) return 'Cada 8 horas';
    if (hours === 6) return 'Cada 6 horas';
    return `Cada ${hours} horas`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Pill className="w-5 h-5 text-[#79D0B8]" />
          Medicamentos Actuales
        </h3>
        {isOwner && (
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir
          </Button>
        )}
      </div>

      {medications.length === 0 ? (
        <Card className="p-6 text-center">
          <Pill className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No hay medicamentos activos</p>
          {isOwner && (
            <Button
              onClick={() => setShowAddDialog(true)}
              variant="outline"
              className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir primer medicamento
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {medications.map((medication) => (
            <Card key={medication.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-gray-800">{medication.medication}</h4>
                    <Badge 
                      variant={medication.source === 'owner' ? 'default' : 'secondary'}
                      className={medication.source === 'owner' ? 'bg-[#79D0B8]' : ''}
                    >
                      {medication.source === 'owner' ? 'Dueño' : `Vet: ${medication.prescribed_by}`}
                    </Badge>
                    {medication.is_permanent && (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        Permanente
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4" />
                      <span>Dosis: {medication.dosage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{getFrequencyText(medication.frequency_hours)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Inicio: {formatDate(medication.start_date)}
                        {medication.end_date && !medication.is_permanent && (
                          <> - Fin: {formatDate(medication.end_date)}</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                {isOwner && medication.source === 'owner' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMedication(medication)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteMedication(medication.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAddDialog && (
        <AddMedicationDialog
          petId={petId}
          onClose={() => setShowAddDialog(false)}
          onMedicationAdded={handleMedicationAdded}
        />
      )}

      {editingMedication && (
        <EditMedicationDialog
          medication={editingMedication}
          onClose={() => setEditingMedication(null)}
          onMedicationUpdated={handleMedicationUpdated}
        />
      )}
    </div>
  );
};

export default CurrentMedicationsSection;
