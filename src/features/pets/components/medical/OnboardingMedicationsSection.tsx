
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/molecules/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Medication {
  id: string;
  medication: string;
  dosage?: string;
  frequency_hours?: number;
  start_date?: string;
  category: 'cronico' | 'suplemento';
  instructions?: string;
}

interface OnboardingMedicationsSectionProps {
  petId: string;
}

const OnboardingMedicationsSection: React.FC<OnboardingMedicationsSectionProps> = ({ petId }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency_hours: 24,
    start_date: '',
    category: 'cronico' as 'cronico' | 'suplemento',
    instructions: ''
  });

  useEffect(() => {
    fetchMedications();
  }, [petId]);

  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('owner_medications')
        .select('*')
        .eq('pet_id', petId)
        .order('medication');

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  const handleAdd = () => {
    setEditingMedication(null);
    setFormData({
      medication: '',
      dosage: '',
      frequency_hours: 24,
      start_date: '',
      category: 'cronico',
      instructions: ''
    });
    setShowDialog(true);
  };

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      medication: medication.medication,
      dosage: medication.dosage || '',
      frequency_hours: medication.frequency_hours || 24,
      start_date: medication.start_date || '',
      category: medication.category,
      instructions: medication.instructions || ''
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.medication.trim()) {
      toast.error('El campo de medicamento es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      if (editingMedication) {
        // Update existing medication
        const { error } = await supabase
          .from('owner_medications')
          .update({
            medication: formData.medication.trim(),
            dosage: formData.dosage.trim() || null,
            frequency_hours: formData.frequency_hours,
            start_date: formData.start_date || null,
            category: formData.category,
            instructions: formData.instructions.trim() || null
          })
          .eq('id', editingMedication.id);

        if (error) throw error;
        toast.success('Medicamento actualizado');
      } else {
        // Create new medication
        const { error } = await supabase
          .from('owner_medications')
          .insert({
            pet_id: petId,
            medication: formData.medication.trim(),
            dosage: formData.dosage.trim() || null,
            frequency_hours: formData.frequency_hours,
            start_date: formData.start_date || null,
            category: formData.category,
            instructions: formData.instructions.trim() || null
          });

        if (error) throw error;
        toast.success('Medicamento guardado');
      }

      setShowDialog(false);
      fetchMedications();
    } catch (error) {
      console.error('Error saving medication:', error);
      toast.error('Error al guardar el medicamento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (medicationId: string) => {
    try {
      const { error } = await supabase
        .from('owner_medications')
        .delete()
        .eq('id', medicationId);

      if (error) throw error;
      toast.success('Medicamento eliminado');
      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Error al eliminar el medicamento');
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Medicamentos</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Añadir medicamento
          </Button>
        </div>

        {medications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sin medicamentos registrados</p>
        ) : (
          <div className="space-y-2">
            {medications.map((medication) => (
              <div key={medication.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{medication.medication}</p>
                  {medication.dosage && (
                    <p className="text-sm text-gray-600">Dosis: {medication.dosage}</p>
                  )}
                  {medication.frequency_hours && (
                    <p className="text-sm text-gray-600">Frecuencia: cada {medication.frequency_hours} horas</p>
                  )}
                  <p className="text-xs text-gray-500 capitalize">{medication.category}</p>
                  {medication.instructions && (
                    <p className="text-sm text-gray-600 mt-1">{medication.instructions}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(medication)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(medication.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMedication ? 'Editar medicamento' : 'Añadir medicamento'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="medication">Medicamento *</Label>
              <Input
                id="medication"
                value={formData.medication}
                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                placeholder="Nombre del medicamento"
              />
            </div>
            
            <div>
              <Label htmlFor="dosage">Dosis</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="Ej: 1 tableta, 5ml, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="frequency">Frecuencia (horas)</Label>
              <Input
                id="frequency"
                type="number"
                min="1"
                value={formData.frequency_hours}
                onChange={(e) => setFormData({ ...formData, frequency_hours: parseInt(e.target.value) || 24 })}
                placeholder="24"
              />
            </div>
            
            <div>
              <Label htmlFor="start_date">Fecha de inicio</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value: 'cronico' | 'suplemento') => 
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cronico">Crónico</SelectItem>
                  <SelectItem value="suplemento">Suplemento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="instructions">Instrucciones adicionales</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Instrucciones especiales..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnboardingMedicationsSection;
