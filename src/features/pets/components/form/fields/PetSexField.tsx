
import React from 'react';
import { Label } from '@/ui/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { Control, Controller } from 'react-hook-form';
import { PetFormValues } from '@/features/pets/types/formTypes';

interface PetSexFieldProps {
  control: Control<PetFormValues>;
}

const PetSexField: React.FC<PetSexFieldProps> = ({ control }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="sex" className="font-medium text-base">
        Sexo
      </Label>
      <Controller
        control={control}
        name="sex"
        render={({ field }) => (
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el sexo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Macho">Macho</SelectItem>
              <SelectItem value="Hembra">Hembra</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};

export default PetSexField;
