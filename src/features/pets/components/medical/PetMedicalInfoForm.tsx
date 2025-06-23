
import React, { useState } from 'react';
import { PetMedicalHistory } from '../../types';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

interface PetMedicalInfoFormProps {
  petId: string;
  onSave: (medicalInfo: PetMedicalHistory) => Promise<void>;
  onCancel: () => void;
}

const PetMedicalInfoForm: React.FC<PetMedicalInfoFormProps> = ({ petId, onSave, onCancel }) => {
  const [allergies, setAllergies] = useState<string>('');
  const [chronicConditions, setChronicConditions] = useState<string>('');
  const [surgeries, setSurgeries] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseJsonArray = (text: string) => {
    if (!text.trim()) return [];
    try {
      // Split by newlines and filter out empty lines
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(item => ({ description: item }));
    } catch (error) {
      console.error('Error parsing text to JSON:', error);
      return [];
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare medical history data
      const medicalInfo: PetMedicalHistory = {
        allergies: allergies || null,
        chronic_conditions: chronicConditions || null,
        previous_surgeries: surgeries ? parseJsonArray(surgeries) : []
      };

      await onSave(medicalInfo);
    } catch (error) {
      console.error('Error saving medical info:', error);
      toast.error('Error al guardar la información médica');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="allergies">Alergias</Label>
        <Textarea
          id="allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Ingrese cualquier alergia conocida"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chronicConditions">Condiciones crónicas</Label>
        <Textarea
          id="chronicConditions"
          value={chronicConditions}
          onChange={(e) => setChronicConditions(e.target.value)}
          placeholder="Ingrese cualquier condición crónica"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="surgeries">Cirugías previas</Label>
        <Textarea
          id="surgeries"
          value={surgeries}
          onChange={(e) => setSurgeries(e.target.value)}
          placeholder="Ingrese una cirugía por línea"
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Ingrese cada cirugía en una línea separada
        </p>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center"
        >
          <Stethoscope className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Guardando...' : 'Guardar información médica'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default PetMedicalInfoForm;
