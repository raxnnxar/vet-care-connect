
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
import { PetChronicCondition } from '@/features/pets/types/formTypes';

interface ChronicConditionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (condition: string, notes?: string) => Promise<void>;
  condition?: PetChronicCondition | null;
  title: string;
}

const ChronicConditionModal: React.FC<ChronicConditionModalProps> = ({
  open,
  onOpenChange,
  onSave,
  condition,
  title
}) => {
  const [conditionName, setConditionName] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (condition) {
      setConditionName(condition.condition || '');
      setNotes(condition.notes || '');
    } else {
      setConditionName('');
      setNotes('');
    }
  }, [condition, open]);

  const handleSave = async () => {
    if (!conditionName.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave(conditionName.trim(), notes.trim() || undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving chronic condition:', error);
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
            <Label htmlFor="condition">Condición crónica *</Label>
            <Input
              id="condition"
              value={conditionName}
              onChange={(e) => setConditionName(e.target.value)}
              placeholder="Ej. Diabetes, Artritis, etc."
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional sobre la condición..."
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
            disabled={!conditionName.trim() || isLoading}
            className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChronicConditionModal;
