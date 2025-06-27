
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';
import { PetSurgery } from '@/features/pets/types/formTypes';

interface SurgeryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (procedure: string, surgery_date?: string, notes?: string) => Promise<void>;
  surgery?: PetSurgery | null;
  title: string;
}

const SurgeryModal: React.FC<SurgeryModalProps> = ({
  open,
  onOpenChange,
  onSave,
  surgery,
  title
}) => {
  const [procedure, setProcedure] = useState('');
  const [surgeryDate, setSurgeryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (surgery) {
      setProcedure(surgery.procedure || '');
      setSurgeryDate(surgery.surgery_date || '');
      setNotes(surgery.notes || '');
    } else {
      setProcedure('');
      setSurgeryDate('');
      setNotes('');
    }
  }, [surgery, open]);

  const handleSave = async () => {
    if (!procedure.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave(
        procedure.trim(), 
        surgeryDate || undefined, 
        notes.trim() || undefined
      );
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving surgery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="procedure">Tipo de cirugía *</Label>
            <Input
              id="procedure"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              placeholder="Ej. Esterilización, Castración, etc."
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="surgery_date">Fecha de la cirugía</Label>
            <Input
              id="surgery_date"
              type="date"
              value={surgeryDate}
              onChange={(e) => setSurgeryDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional sobre la cirugía..."
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!procedure.trim() || isLoading}
            className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SurgeryModal;
