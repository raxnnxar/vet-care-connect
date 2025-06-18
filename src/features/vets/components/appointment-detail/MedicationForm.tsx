
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';

interface MedicationFormProps {
  onSave: (medication: {
    medication: string;
    dosage: string;
    frequency_hours: number;
    duration_days: number;
    start_date: string;
    instructions: string | null;
  }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const MedicationForm: React.FC<MedicationFormProps> = ({
  onSave,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency_hours: '',
    duration_days: '',
    start_date: new Date().toISOString().split('T')[0],
    instructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medication.trim() || !formData.dosage.trim() || 
        !formData.frequency_hours || !formData.duration_days) {
      return;
    }

    onSave({
      medication: formData.medication.trim(),
      dosage: formData.dosage.trim(),
      frequency_hours: parseInt(formData.frequency_hours),
      duration_days: parseInt(formData.duration_days),
      start_date: formData.start_date,
      instructions: formData.instructions.trim() || null
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medication">Medicamento *</Label>
          <Input
            id="medication"
            value={formData.medication}
            onChange={(e) => handleChange('medication', e.target.value)}
            placeholder="Nombre del medicamento"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosis *</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            placeholder="ej. 1 cápsula, 5ml"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency_hours">Frecuencia (horas) *</Label>
          <Input
            id="frequency_hours"
            type="number"
            value={formData.frequency_hours}
            onChange={(e) => handleChange('frequency_hours', e.target.value)}
            placeholder="ej. 8, 12, 24"
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration_days">Duración (días) *</Label>
          <Input
            id="duration_days"
            type="number"
            value={formData.duration_days}
            onChange={(e) => handleChange('duration_days', e.target.value)}
            placeholder="ej. 7, 14"
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_date">Fecha de inicio</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange('start_date', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructions">Instrucciones adicionales</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => handleChange('instructions', e.target.value)}
          placeholder="ej. dar con comida, no administrar con el estómago vacío..."
          rows={2}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
        >
          {isLoading ? 'Guardando...' : 'Guardar Medicamento'}
        </Button>
      </div>
    </form>
  );
};

export default MedicationForm;
