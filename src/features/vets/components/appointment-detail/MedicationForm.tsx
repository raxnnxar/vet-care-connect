
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { FormItem, FormLabel, FormControl } from '@/ui/molecules/form';

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
        <FormItem>
          <FormLabel>Medicamento *</FormLabel>
          <FormControl>
            <Input
              value={formData.medication}
              onChange={(e) => handleChange('medication', e.target.value)}
              placeholder="Nombre del medicamento"
              required
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Dosis *</FormLabel>
          <FormControl>
            <Input
              value={formData.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
              placeholder="ej. 1 cápsula, 5ml"
              required
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Frecuencia (horas) *</FormLabel>
          <FormControl>
            <Input
              type="number"
              value={formData.frequency_hours}
              onChange={(e) => handleChange('frequency_hours', e.target.value)}
              placeholder="ej. 8, 12, 24"
              min="1"
              required
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Duración (días) *</FormLabel>
          <FormControl>
            <Input
              type="number"
              value={formData.duration_days}
              onChange={(e) => handleChange('duration_days', e.target.value)}
              placeholder="ej. 7, 14"
              min="1"
              required
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel>Fecha de inicio</FormLabel>
          <FormControl>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
            />
          </FormControl>
        </FormItem>
      </div>

      <FormItem>
        <FormLabel>Instrucciones adicionales</FormLabel>
        <FormControl>
          <Textarea
            value={formData.instructions}
            onChange={(e) => handleChange('instructions', e.target.value)}
            placeholder="ej. dar con comida, no administrar con el estómago vacío..."
            rows={2}
          />
        </FormControl>
      </FormItem>

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
