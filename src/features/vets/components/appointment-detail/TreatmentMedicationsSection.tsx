
import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MedicationForm from './MedicationForm';
import MedicationsList from './MedicationsList';

interface TreatmentMedicationsSectionProps {
  treatmentCaseId: string;
}

interface Medication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  duration_days: number;
  start_date: string;
  instructions: string | null;
}

const TreatmentMedicationsSection: React.FC<TreatmentMedicationsSectionProps> = ({
  treatmentCaseId
}) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('treatment_medications')
        .select('*')
        .eq('treatment_case_id', treatmentCaseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching medications:', error);
        return;
      }

      setMedications(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [treatmentCaseId]);

  const handleAddMedication = async (medicationData: Omit<Medication, 'id'>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('treatment_medications')
        .insert({
          treatment_case_id: treatmentCaseId,
          ...medicationData
        });

      if (error) {
        console.error('Error adding medication:', error);
        toast.error('Error al agregar medicamento');
        return;
      }

      toast.success('Medicamento agregado exitosamente');
      setShowForm(false);
      fetchMedications();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al agregar medicamento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💊</span>
          <h4 className="text-lg font-semibold text-gray-800">Medicamentos recetados</h4>
        </div>
        
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="text-[#79D0B8] border-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
          >
            ➕ Agregar medicamento
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-4">
          <MedicationForm
            onSave={handleAddMedication}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </Card>
      )}

      <MedicationsList medications={medications} />
    </div>
  );
};

export default TreatmentMedicationsSection;
