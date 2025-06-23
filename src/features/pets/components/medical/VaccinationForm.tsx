
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Checkbox } from '@/ui/atoms/checkbox';
import { Card } from '@/ui/molecules/card';
import { X } from 'lucide-react';
import { CreateVaccinationRecord } from '../../types/vaccinationTypes';

interface VaccinationFormProps {
  petId: string;
  onSubmit: (record: CreateVaccinationRecord) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const VaccinationForm: React.FC<VaccinationFormProps> = ({
  petId,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [vaccineName, setVaccineName] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [needsBooster, setNeedsBooster] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!vaccineName.trim() || !applicationDate) {
      return;
    }

    const record: CreateVaccinationRecord = {
      pet_id: petId,
      vaccine_name: vaccineName.trim(),
      application_date: applicationDate,
      needs_booster: needsBooster,
      notes: notes.trim() || undefined
    };

    const success = await onSubmit(record);
    if (success) {
      setVaccineName('');
      setApplicationDate('');
      setNeedsBooster(false);
      setNotes('');
      onCancel();
    }
  };

  return (
    <Card className="p-4 border-2 border-[#79D0B8]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Nueva vacuna</h4>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vaccine-name">Nombre de la vacuna *</Label>
          <Input
            id="vaccine-name"
            value={vaccineName}
            onChange={(e) => setVaccineName(e.target.value)}
            placeholder="Ej: Triple viral, Rabia, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="application-date">Fecha de aplicación *</Label>
          <Input
            id="application-date"
            type="date"
            value={applicationDate}
            onChange={(e) => setApplicationDate(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="needs-booster"
            checked={needsBooster}
            onCheckedChange={(checked) => setNeedsBooster(checked as boolean)}
          />
          <Label htmlFor="needs-booster">¿Requiere refuerzo?</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Información adicional sobre la vacuna..."
            rows={3}
          />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Nota:</strong> Si no conoces la fecha exacta o los refuerzos, puedes dejarlo en blanco y tu veterinario lo completará después.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
            disabled={isSubmitting || !vaccineName.trim() || !applicationDate}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar vacuna'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VaccinationForm;
