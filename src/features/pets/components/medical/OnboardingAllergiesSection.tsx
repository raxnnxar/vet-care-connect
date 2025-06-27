
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

interface Allergy {
  id: string;
  allergen: string;
  notes?: string;
}

interface OnboardingAllergiesSectionProps {
  petId: string;
}

const OnboardingAllergiesSection: React.FC<OnboardingAllergiesSectionProps> = ({ petId }) => {
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAllergy, setEditingAllergy] = useState<Allergy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    allergen: '',
    notes: ''
  });

  useEffect(() => {
    fetchAllergies();
  }, [petId]);

  const fetchAllergies = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_allergies')
        .select('*')
        .eq('pet_id', petId)
        .order('allergen');

      if (error) throw error;
      setAllergies(data || []);
    } catch (error) {
      console.error('Error fetching allergies:', error);
    }
  };

  const handleAdd = () => {
    setEditingAllergy(null);
    setFormData({ allergen: '', notes: '' });
    setShowDialog(true);
  };

  const handleEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy);
    setFormData({
      allergen: allergy.allergen,
      notes: allergy.notes || ''
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.allergen.trim()) {
      toast.error('El campo de alergia es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      if (editingAllergy) {
        // Update existing allergy
        const { error } = await supabase
          .from('pet_allergies')
          .update({
            allergen: formData.allergen.trim(),
            notes: formData.notes.trim() || null
          })
          .eq('id', editingAllergy.id);

        if (error) throw error;
        toast.success('Alergia actualizada');
      } else {
        // Create new allergy
        const { error } = await supabase
          .from('pet_allergies')
          .insert({
            pet_id: petId,
            allergen: formData.allergen.trim(),
            notes: formData.notes.trim() || null
          });

        if (error) throw error;
        toast.success('Alergia guardada');
      }

      setShowDialog(false);
      fetchAllergies();
    } catch (error) {
      console.error('Error saving allergy:', error);
      toast.error('Error al guardar la alergia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (allergyId: string) => {
    try {
      const { error } = await supabase
        .from('pet_allergies')
        .delete()
        .eq('id', allergyId);

      if (error) throw error;
      toast.success('Alergia eliminada');
      fetchAllergies();
    } catch (error) {
      console.error('Error deleting allergy:', error);
      toast.error('Error al eliminar la alergia');
    }
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Alergias</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Añadir alergia
          </Button>
        </div>

        {allergies.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sin alergias registradas</p>
        ) : (
          <div className="space-y-2">
            {allergies.map((allergy) => (
              <div key={allergy.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{allergy.allergen}</p>
                  {allergy.notes && (
                    <p className="text-sm text-gray-600">{allergy.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(allergy)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(allergy.id)}
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
              {editingAllergy ? 'Editar alergia' : 'Añadir alergia'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="allergen">Alergia *</Label>
              <Input
                id="allergen"
                value={formData.allergen}
                onChange={(e) => setFormData({ ...formData, allergen: e.target.value })}
                placeholder="Ej: Polen, medicamento específico..."
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detalles sobre la alergia..."
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

export default OnboardingAllergiesSection;
