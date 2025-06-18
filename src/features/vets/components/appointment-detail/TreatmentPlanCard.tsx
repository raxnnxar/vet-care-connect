
import React, { useState } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';
import { FormItem, FormLabel, FormControl } from '@/ui/molecules/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TreatmentMedicationsSection from './TreatmentMedicationsSection';

interface TreatmentPlanCardProps {
  appointmentId: string;
  petId: string;
  veterinarianId: string;
}

const TreatmentPlanCard: React.FC<TreatmentPlanCardProps> = ({
  appointmentId,
  petId,
  veterinarianId
}) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [treatmentCaseId, setTreatmentCaseId] = useState<string | null>(null);

  const handleSaveTreatmentCase = async () => {
    if (!diagnosis.trim()) {
      toast.error('El diagnóstico es requerido');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('treatment_cases')
        .insert({
          pet_id: petId,
          appointment_id: appointmentId,
          veterinarian_id: veterinarianId,
          diagnosis: diagnosis.trim(),
          instructions_for_owner: instructions.trim() || null,
          start_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating treatment case:', error);
        toast.error('Error al guardar el plan de tratamiento');
        return;
      }

      setTreatmentCaseId(data.id);
      toast.success('Plan de tratamiento guardado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar el plan de tratamiento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🩺</span>
        <h3 className="text-lg font-semibold text-gray-800">Plan de tratamiento</h3>
      </div>

      {!treatmentCaseId ? (
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Diagnóstico general</FormLabel>
            <FormControl>
              <Input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Ingrese el diagnóstico"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Instrucciones generales para el dueño</FormLabel>
            <FormControl>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instrucciones para el cuidado en casa..."
                rows={3}
              />
            </FormControl>
          </FormItem>

          <Button 
            onClick={handleSaveTreatmentCase}
            disabled={isLoading}
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
          >
            {isLoading ? 'Guardando...' : 'Guardar Plan de Tratamiento'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="mb-2">
              <Label className="font-medium">Diagnóstico:</Label>
              <p className="text-gray-700">{diagnosis}</p>
            </div>
            {instructions && (
              <div>
                <Label className="font-medium">Instrucciones:</Label>
                <p className="text-gray-700">{instructions}</p>
              </div>
            )}
          </div>

          <TreatmentMedicationsSection treatmentCaseId={treatmentCaseId} />
        </div>
      )}
    </Card>
  );
};

export default TreatmentPlanCard;
