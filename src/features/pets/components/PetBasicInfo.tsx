
import React from 'react';
import { Input } from '@/ui/atoms/input';
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

export const speciesMapping = {
  'Perro': PET_CATEGORIES.DOG,
  'Gato': PET_CATEGORIES.CAT,
  'Tortuga': PET_CATEGORIES.REPTILE,
  'Ave': PET_CATEGORIES.BIRD,
  'Conejo': PET_CATEGORIES.SMALL_MAMMAL,
  'Hámster': PET_CATEGORIES.SMALL_MAMMAL,
  'Otro': PET_CATEGORIES.OTHER,
};

interface PetBasicInfoProps {
  control: Control<any>;
  register: any;
  errors: FieldErrors;
  selectedSpecies: string;
}

const PetBasicInfo: React.FC<PetBasicInfoProps> = ({
  control,
  register,
  errors,
  selectedSpecies
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="font-medium text-base">
          Nombre *
        </Label>
        <Input
          id="name"
          {...register('name', { required: "El nombre es obligatorio" })}
          placeholder="Nombre de tu mascota"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message as string}</p>
        )}
      </div>
      
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

      {selectedSpecies === 'Otro' && (
        <div className="space-y-2">
          <Label htmlFor="customSpecies" className="font-medium text-base">
            Especifica el tipo de animal *
          </Label>
          <Input
            id="customSpecies"
            {...register('customSpecies', { 
              required: selectedSpecies === 'Otro' ? "Por favor especifica el tipo de animal" : false 
            })}
            placeholder="Tipo de animal"
            className={errors.customSpecies ? "border-red-500" : ""}
          />
          {errors.customSpecies && (
            <p className="text-sm text-red-500 mt-1">{errors.customSpecies.message as string}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="age" className="font-medium text-base">
            Edad (años)
          </Label>
          <Input
            id="age"
            type="number"
            {...register('age', { 
              valueAsNumber: true,
              min: { value: 0, message: "La edad no puede ser negativa" },
              max: { value: 100, message: "La edad parece ser demasiado alta" }
            })}
            placeholder="Edad en años"
            className={errors.age ? "border-red-500" : ""}
          />
          {errors.age && (
            <p className="text-sm text-red-500 mt-1">{errors.age.message as string}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight" className="font-medium text-base">
            Peso (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            {...register('weight', { 
              valueAsNumber: true,
              min: { value: 0, message: "El peso no puede ser negativo" },
              max: { value: 1000, message: "El peso parece ser demasiado alto" }
            })}
            placeholder="Peso en kg"
            className={errors.weight ? "border-red-500" : ""}
          />
          {errors.weight && (
            <p className="text-sm text-red-500 mt-1">{errors.weight.message as string}</p>
          )}
        </div>
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="temperament" className="font-medium text-base">
          Temperamento
        </Label>
        <Input
          id="temperament"
          {...register('temperament')}
          placeholder="Ej: Juguetón, Tranquilo, Cariñoso"
          className={errors.temperament ? "border-red-500" : ""}
        />
      </div>
    </>
  );
};

export default PetBasicInfo;
