
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/atoms/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Medication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  start_date: string;
  category: 'cronico' | 'suplemento';
  source: 'owner' | 'vet';
  prescribed_by?: string;
  treatment_case_id?: string;
}

interface EditMedicationDialogProps {
  medication: Medication;
  onClose: () => void;
  onMedicationUpdated: () => void;
}

const EditMedicationDialog: React.FC<EditMedicationDialogProps> = ({
  medication,
  onClose,
  onMedicationUpdated
}) => {
  const [formData, setFormData] = useState({
    medication: medication.medication,
    dosage: medication.dosage,
    frequency_hours: medication.frequency_hours,
    start_date: medication.start_date,
    category: medication.category,
    instructions: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      medication: medication.medication,
      dosage: medication.dosage,
      frequency_hours: medication.frequency_hours,
      start_date: medication.start_date,
      category: medication.category,
      instructions: ''
    });
  }, [medication]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (medication.source !== 'owner') {
      toast.error('Solo puedes editar medicamentos agregados por ti');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('owner_medications')
        .update({
          medication: formData.medication,
          dosage: formData.dosage,
          frequency_hours: formData.frequency_hours,
          start_date: formData.start_date,
          category: formData.category,
          instructions: formData.instructions
        })
        .eq('id', medication.id);

      if (error) throw error;

      toast.success('Medicamento actualizado exitosamente');
      onMedicationUpdated();
    } catch (error) {
      console.error('Error updating medication:', error);
      toast.error('Error al actualizar el medicamento');
    } finally {
      setIsLoading(false);
    }
  };

  const frequencyOptions = [
    { value: 6, label: 'Cada 6 horas' },
    { value: 8, label: 'Cada 8 horas' },
    { value: 12, label: 'Cada 12 horas' },
    { value: 24, label: 'Una vez al día' },
    { value: 48, label: 'Cada 2 días' },
    { value: 168, label: 'Una vez a la semana' }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Medicamento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="medication">Nombre del medicamento</Label>
            <Input
              id="medication"
              value={formData.medication}
              onChange={(e) => setFormData(prev => ({ ...prev, medication: e.target.value }))}
              placeholder="Ej: Paracetamol"
              required
            />
          </div>

          <div>
            <Label htmlFor="dosage">Dosis</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="Ej: 500mg, 1 tableta"
              required
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frecuencia</Label>
            <Select 
              value={formData.frequency_hours.toString()} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency_hours: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la frecuencia" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: 'cronico' | 'suplemento') => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona la categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cronico">Crónico</SelectItem>
                <SelectItem value="suplemento">Suplemento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="start_date">Fecha de inicio</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instrucciones (opcional)</Label>
            <Input
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Instrucciones adicionales"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicationDialog;
