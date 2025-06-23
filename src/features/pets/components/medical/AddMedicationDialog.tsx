
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Checkbox } from '@/ui/atoms/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/molecules/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddMedicationDialogProps {
  petId: string;
  onClose: () => void;
  onMedicationAdded: () => void;
}

const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({
  petId,
  onClose,
  onMedicationAdded
}) => {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequencyHours, setFrequencyHours] = useState('24');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!medication.trim() || !dosage.trim()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('owner_medications')
        .insert({
          pet_id: petId,
          medication: medication.trim(),
          dosage: dosage.trim(),
          frequency_hours: parseInt(frequencyHours),
          start_date: startDate,
          end_date: isPermanent ? null : (endDate || null),
          is_permanent: isPermanent
        });

      if (error) throw error;

      toast.success('Medicamento añadido exitosamente');
      onMedicationAdded();
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Error al añadir el medicamento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añadir Medicamento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medication">Nombre del medicamento *</Label>
            <Input
              id="medication"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              placeholder="Ej: Amoxicilina"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosis *</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Ej: 1 cápsula, 5ml, 250mg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia</Label>
            <Select value={frequencyHours} onValueChange={setFrequencyHours}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Cada 6 horas</SelectItem>
                <SelectItem value="8">Cada 8 horas</SelectItem>
                <SelectItem value="12">Cada 12 horas</SelectItem>
                <SelectItem value="24">Una vez al día</SelectItem>
                <SelectItem value="48">Cada 2 días</SelectItem>
                <SelectItem value="72">Cada 3 días</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha de inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="permanent"
              checked={isPermanent}
              onCheckedChange={setIsPermanent}
            />
            <Label htmlFor="permanent">Medicamento permanente</Label>
          </div>

          {!isPermanent && (
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de fin (opcional)</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Añadiendo...' : 'Añadir medicamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationDialog;
