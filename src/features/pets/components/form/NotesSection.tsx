
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { UseFormRegister } from 'react-hook-form';
import { PetFormValues } from '@/features/pets/types/formTypes';

interface NotesSectionProps {
  register: UseFormRegister<PetFormValues>;
}

const NotesSection: React.FC<NotesSectionProps> = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="additionalNotes" className="font-medium text-base">
        Notas adicionales
      </Label>
      <Textarea
        id="additionalNotes"
        {...register('additionalNotes')}
        placeholder="Información adicional relevante sobre tu mascota"
        className="min-h-[100px]"
      />
    </div>
  );
};

export default NotesSection;
