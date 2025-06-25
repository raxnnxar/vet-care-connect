
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Checkbox } from '@/ui/atoms/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VaccinationFormProps {
  petId: string;
  onClose: () => void;
  onVaccinationAdded: () => void;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  petId,
  onClose,
  onVaccinationAdded
}) => {
  const [formData, setFormData] = useState({
    vaccine_name: '',
    application_date: '',
    next_due_date: '',
    manufacturer: '',
    lot_number: '',
    lot_expiry_date: '',
    anatomical_site: '',
    route: '',
    notes: '',
    needs_booster: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('vaccination_records')
        .insert({
          pet_id: petId,
          vaccine_name: formData.vaccine_name,
          application_date: formData.application_date,
          next_due_date: formData.next_due_date || null,
          manufacturer: formData.manufacturer || null,
          lot_number: formData.lot_number || null,
          lot_expiry_date: formData.lot_expiry_date || null,
          anatomical_site: formData.anatomical_site || null,
          route: formData.route || null,
          notes: formData.notes || null,
          needs_booster: formData.needs_booster
        });

      if (error) throw error;

      toast.success('Vacuna registrada exitosamente');
      onVaccinationAdded();
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast.error('Error al registrar la vacuna');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Vacuna</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vaccine_name">Nombre de la vacuna *</Label>
            <Input
              id="vaccine_name"
              value={formData.vaccine_name}
              onChange={(e) => setFormData(prev => ({ ...prev, vaccine_name: e.target.value }))}
              placeholder="Ej: Rabia, Parvovirus, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="application_date">Fecha de aplicación *</Label>
            <Input
              id="application_date"
              type="date"
              value={formData.application_date}
              onChange={(e) => setFormData(prev => ({ ...prev, application_date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="next_due_date">Próxima fecha (opcional)</Label>
            <Input
              id="next_due_date"
              type="date"
              value={formData.next_due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, next_due_date: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manufacturer">Laboratorio</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                placeholder="Ej: Zoetis, MSD"
              />
            </div>

            <div>
              <Label htmlFor="lot_number">Número de lote</Label>
              <Input
                id="lot_number"
                value={formData.lot_number}
                onChange={(e) => setFormData(prev => ({ ...prev, lot_number: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lot_expiry_date">Fecha de vencimiento del lote</Label>
            <Input
              id="lot_expiry_date"
              type="date"
              value={formData.lot_expiry_date}
              onChange={(e) => setFormData(prev => ({ ...prev, lot_expiry_date: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="anatomical_site">Sitio anatómico</Label>
              <Input
                id="anatomical_site"
                value={formData.anatomical_site}
                onChange={(e) => setFormData(prev => ({ ...prev, anatomical_site: e.target.value }))}
                placeholder="Ej: Cuello, Muslo"
              />
            </div>

            <div>
              <Label htmlFor="route">Vía de administración</Label>
              <Input
                id="route"
                value={formData.route}
                onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                placeholder="Ej: Subcutánea, IM"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observaciones, reacciones, etc."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="needs_booster"
              checked={formData.needs_booster}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, needs_booster: checked as boolean }))
              }
            />
            <Label htmlFor="needs_booster">Requiere refuerzo</Label>
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
              {isLoading ? 'Guardando...' : 'Registrar vacuna'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VaccinationForm;
