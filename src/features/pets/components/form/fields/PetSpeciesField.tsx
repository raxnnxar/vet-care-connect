
import React from 'react';
import { Label } from '@/ui/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { Dog, Cat, Turtle, Bird, Rabbit, Info } from 'lucide-react';
import { PET_CATEGORIES } from '@/core/constants/app.constants';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { PetFormValues } from '@/features/pets/types/formTypes';

// Define speciesMapping only once
export const speciesMapping = {
  'Perro': PET_CATEGORIES.DOG,
  'Gato': PET_CATEGORIES.CAT,
  'Tortuga': PET_CATEGORIES.REPTILE,
  'Ave': PET_CATEGORIES.BIRD,
  'Conejo': PET_CATEGORIES.SMALL_MAMMAL,
  'Hámster': PET_CATEGORIES.SMALL_MAMMAL,
  'Otro': PET_CATEGORIES.OTHER,
};

interface PetSpeciesFieldProps {
  control: Control<PetFormValues>;
  errors: FieldErrors<PetFormValues>;
}

const PetSpeciesField: React.FC<PetSpeciesFieldProps> = ({ control, errors }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="species" className="font-medium text-base">
        Animal *
      </Label>
      <Controller
        control={control}
        name="species"
        rules={{ required: "Debes seleccionar un tipo de animal" }}
        render={({ field }) => (
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <SelectTrigger className={errors.species ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecciona un animal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Perro">
                <div className="flex items-center gap-2">
                  <Dog className="h-4 w-4" />
                  <span>Perro</span>
                </div>
              </SelectItem>
              <SelectItem value="Gato">
                <div className="flex items-center gap-2">
                  <Cat className="h-4 w-4" />
                  <span>Gato</span>
                </div>
              </SelectItem>
              <SelectItem value="Tortuga">
                <div className="flex items-center gap-2">
                  <Turtle className="h-4 w-4" />
                  <span>Tortuga</span>
                </div>
              </SelectItem>
              <SelectItem value="Ave">
                <div className="flex items-center gap-2">
                  <Bird className="h-4 w-4" />
                  <span>Ave</span>
                </div>
              </SelectItem>
              <SelectItem value="Conejo">
                <div className="flex items-center gap-2">
                  <Rabbit className="h-4 w-4" />
                  <span>Conejo</span>
                </div>
              </SelectItem>
              <SelectItem value="Hámster">
                <div className="flex items-center gap-2">
                  <Rabbit className="h-4 w-4" />
                  <span>Hámster</span>
                </div>
              </SelectItem>
              <SelectItem value="Otro">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Otro</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {errors.species && (
        <p className="text-sm text-red-500 mt-1">{errors.species.message as string}</p>
      )}
    </div>
  );
};

export default PetSpeciesField;
// Remove the duplicate export { speciesMapping }; line that was here
