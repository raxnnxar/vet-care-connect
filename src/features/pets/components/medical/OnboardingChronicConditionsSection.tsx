
import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Plus, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ChronicCondition {
  id: string;
  condition: string;
  notes?: string;
}

interface OnboardingChronicConditionsSectionProps {
  petId: string;
}

const OnboardingChronicConditionsSection: React.FC<OnboardingChronicConditionsSectionProps> = ({ petId }) => {
  const [conditions, setConditions] = useState<ChronicCondition[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCondition, setEditingCondition] = useState<ChronicCondition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    condition: '',
    notes: ''
  });

  useEffect(() => {
    fetchConditions();
  }, [petId]);

  const fetchConditions = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_chronic_conditions')
        .select('*')
        .eq('pet_id', petId)
        .order('condition');

      if (error) throw error;
      setConditions(data || []);
    } catch (error) {
      console.error('Error fetching chronic conditions:', error);
    }
  };

  const handleAdd = () => {
    setEditingCondition(null);
    setFormData({ condition: '', notes: '' });
    setShowDialog(true);
  };

  const handleEdit = (condition: ChronicCondition) => {
    setEditingCondition(condition);
    setFormData({
      condition: condition.condition,
      notes: condition.notes || ''
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.condition.trim()) {
      toast.error('El campo de condición es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      if (editingCondition) {
        // Update existing condition
        const { error } = await supabase
          .from('pet_chronic_conditions')
          .update({
            condition: formData.condition.trim(),
            notes: formData.notes.trim() || null
          })
          .eq('id', editingCondition.id);

        if (error) throw error;
        toast.success('Condición actualizada');
      } else {
        // Create new condition
        const { error } = await supabase
          .from('pet_chronic_conditions')
          .insert({
            pet_id: petId,
            condition: formData.condition.trim(),
            notes: formData.notes.trim() || null
          });

        if (error) throw error;
        toast.success('Condición guardada');
      }

      setShowDialog(false);
      fetchConditions();
    } catch (error) {
      console.error('Error saving chronic condition:', error);
      toast.error('Error al guardar la condición');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (conditionId: string) => {
    try {
      const { error } = await supabase
        .from('pet_chronic_conditions')
        .delete()
        .eq('id', conditionId);

      if (error) throw error;
      toast.success('Condición eliminada');
      fetchConditions();
    } catch (error) {
      console.error('Error deleting chronic condition:', error);
      toast.error('Error al eliminar la condición');
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Condiciones crónicas</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Añadir condición
          </Button>
        </div>

        {conditions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sin condiciones crónicas registradas</p>
        ) : (
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{condition.condition}</p>
                  {condition.notes && (
                    <p className="text-sm text-gray-600">{condition.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(condition)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(condition.id)}
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
              {editingCondition ? 'Editar condición' : 'Añadir condición crónica'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition">Condición *</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                placeholder="Ej: Diabetes, artritis, problemas cardíacos..."
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detalles sobre la condición..."
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

export default OnboardingChronicConditionsSection;
