
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

interface Surgery {
  id: string;
  procedure: string;
  surgery_date?: string;
  notes?: string;
}

interface OnboardingSurgeriesSectionProps {
  petId: string;
}

const OnboardingSurgeriesSection: React.FC<OnboardingSurgeriesSectionProps> = ({ petId }) => {
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingSurgery, setEditingSurgery] = useState<Surgery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    procedure: '',
    surgery_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchSurgeries();
  }, [petId]);

  const fetchSurgeries = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_surgeries')
        .select('*')
        .eq('pet_id', petId)
        .order('surgery_date', { ascending: false, nullsFirst: false });

      if (error) throw error;
      setSurgeries(data || []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
    }
  };

  const handleAdd = () => {
    setEditingSurgery(null);
    setFormData({ procedure: '', surgery_date: '', notes: '' });
    setShowDialog(true);
  };

  const handleEdit = (surgery: Surgery) => {
    setEditingSurgery(surgery);
    setFormData({
      procedure: surgery.procedure,
      surgery_date: surgery.surgery_date || '',
      notes: surgery.notes || ''
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!formData.procedure.trim()) {
      toast.error('El campo de procedimiento es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      if (editingSurgery) {
        // Update existing surgery
        const { error } = await supabase
          .from('pet_surgeries')
          .update({
            procedure: formData.procedure.trim(),
            surgery_date: formData.surgery_date || null,
            notes: formData.notes.trim() || null
          })
          .eq('id', editingSurgery.id);

        if (error) throw error;
        toast.success('Cirugía actualizada');
      } else {
        // Create new surgery
        const { error } = await supabase
          .from('pet_surgeries')
          .insert({
            pet_id: petId,
            procedure: formData.procedure.trim(),
            surgery_date: formData.surgery_date || null,
            notes: formData.notes.trim() || null
          });

        if (error) throw error;
        toast.success('Cirugía guardada');
      }

      setShowDialog(false);
      fetchSurgeries();
    } catch (error) {
      console.error('Error saving surgery:', error);
      toast.error('Error al guardar la cirugía');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (surgeryId: string) => {
    try {
      const { error } = await supabase
        .from('pet_surgeries')
        .delete()
        .eq('id', surgeryId);

      if (error) throw error;
      toast.success('Cirugía eliminada');
      fetchSurgeries();
    } catch (error) {
      console.error('Error deleting surgery:', error);
      toast.error('Error al eliminar la cirugía');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Cirugías previas</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Añadir cirugía
          </Button>
        </div>

        {surgeries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Sin cirugías registradas</p>
        ) : (
          <div className="space-y-2">
            {surgeries.map((surgery) => (
              <div key={surgery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{surgery.procedure}</p>
                  {surgery.surgery_date && (
                    <p className="text-sm text-gray-600">Fecha: {formatDate(surgery.surgery_date)}</p>
                  )}
                  {surgery.notes && (
                    <p className="text-sm text-gray-600">{surgery.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(surgery)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(surgery.id)}
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
              {editingSurgery ? 'Editar cirugía' : 'Añadir cirugía'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="procedure">Procedimiento *</Label>
              <Input
                id="procedure"
                value={formData.procedure}
                onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                placeholder="Ej: Esterilización, extracción de tumor..."
              />
            </div>
            
            <div>
              <Label htmlFor="surgery_date">Fecha de la cirugía</Label>
              <Input
                id="surgery_date"
                type="date"
                value={formData.surgery_date}
                onChange={(e) => setFormData({ ...formData, surgery_date: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detalles sobre la cirugía..."
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

export default OnboardingSurgeriesSection;
