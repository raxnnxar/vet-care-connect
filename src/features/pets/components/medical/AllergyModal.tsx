
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
import { PetAllergy } from '@/features/pets/types/formTypes';

interface AllergyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (allergen: string, notes?: string) => Promise<void>;
  allergy?: PetAllergy | null;
  title: string;
}

const AllergyModal: React.FC<AllergyModalProps> = ({
  open,
  onOpenChange,
  onSave,
  allergy,
  title
}) => {
  const [allergen, setAllergen] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (allergy) {
      setAllergen(allergy.allergen || '');
      setNotes(allergy.notes || '');
    } else {
      setAllergen('');
      setNotes('');
    }
  }, [allergy, open]);

  const handleSave = async () => {
    if (!allergen.trim()) return;
    
    setIsLoading(true);
    try {
      await onSave(allergen.trim(), notes.trim() || undefined);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving allergy:', error);
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
            <Label htmlFor="allergen">Alérgeno *</Label>
            <Input
              id="allergen"
              value={allergen}
              onChange={(e) => setAllergen(e.target.value)}
              placeholder="Ej. Penicilina, Polen, etc."
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Información adicional sobre la alergia..."
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
            disabled={!allergen.trim() || isLoading}
            className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllergyModal;
