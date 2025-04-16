
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dog, Cat, Turtle, Bird, Rabbit, Info } from 'lucide-react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Button } from '@/ui/atoms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { toast } from 'sonner';
import { PET_CATEGORIES, PET_GENDER } from '@/core/constants/app.constants';

// Spanish to English mapping for species
const speciesMapping = {
  'Perro': PET_CATEGORIES.DOG,
  'Gato': PET_CATEGORIES.CAT,
  'Tortuga': PET_CATEGORIES.REPTILE,
  'Ave': PET_CATEGORIES.BIRD,
  'Conejo': PET_CATEGORIES.SMALL_MAMMAL,
  'Hámster': PET_CATEGORIES.SMALL_MAMMAL,
  'Otro': PET_CATEGORIES.OTHER,
};

// Spanish to English mapping for gender
const genderMapping = {
  'Macho': PET_GENDER.MALE,
  'Hembra': PET_GENDER.FEMALE,
};

// English to Spanish mapping for species (for displaying data)
const speciesMappingReverse = {
  [PET_CATEGORIES.DOG]: 'Perro',
  [PET_CATEGORIES.CAT]: 'Gato',
  [PET_CATEGORIES.REPTILE]: 'Tortuga',
  [PET_CATEGORIES.BIRD]: 'Ave',
  [PET_CATEGORIES.SMALL_MAMMAL]: 'Conejo/Hámster',
  [PET_CATEGORIES.OTHER]: 'Otro',
};

// English to Spanish mapping for gender (for displaying data)
const genderMappingReverse = {
  [PET_GENDER.MALE]: 'Macho',
  [PET_GENDER.FEMALE]: 'Hembra',
};

// Species icon mapping
const SpeciesIcon = ({ species }) => {
  switch(species) {
    case 'Perro':
      return <Dog className="h-4 w-4" />;
    case 'Gato':
      return <Cat className="h-4 w-4" />;
    case 'Tortuga':
      return <Turtle className="h-4 w-4" />;
    case 'Ave':
      return <Bird className="h-4 w-4" />;
    case 'Conejo':
    case 'Hámster':
      return <Rabbit className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

interface PetFormValues {
  name: string;
  species: string;
  customSpecies?: string;
  age: number;
  weight: number;
  sex: string;
  temperament: string;
  additionalNotes: string;
}

interface PetFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PetFormValues>({
    defaultValues: {
      name: '',
      species: '',
      customSpecies: '',
      age: undefined,
      weight: undefined,
      sex: '',
      temperament: '',
      additionalNotes: '',
    }
  });
  
  const selectedSpecies = watch('species');
  
  const processFormData = (data: PetFormValues) => {
    // Transform form data for database storage
    const transformedData = {
      name: data.name,
      species: data.species === 'Otro' ? PET_CATEGORIES.OTHER : speciesMapping[data.species],
      breed: data.species === 'Otro' ? data.customSpecies : '',
      // For age, ideally we'd calculate a birth date, but for now just storing as a note
      additional_notes: `Edad: ${data.age} años. ${data.additionalNotes}`,
      weight: data.weight,
      sex: genderMapping[data.sex],
      temperament: data.temperament,
    };
    
    onSubmit(transformedData);
  };
  
  return (
    <form onSubmit={handleSubmit(processFormData)} className="space-y-4">
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
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
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
          <p className="text-sm text-red-500 mt-1">{errors.species.message}</p>
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
            <p className="text-sm text-red-500 mt-1">{errors.customSpecies.message}</p>
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
            <p className="text-sm text-red-500 mt-1">{errors.age.message}</p>
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
            <p className="text-sm text-red-500 mt-1">{errors.weight.message}</p>
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
      
      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="font-medium text-base">
          Notas adicionales
        </Label>
        <Textarea
          id="additionalNotes"
          {...register('additionalNotes')}
          placeholder="Información adicional relevante sobre tu mascota"
          className={`min-h-[100px] ${errors.additionalNotes ? "border-red-500" : ""}`}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 text-base font-medium mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : 'Guardar mascota'}
      </Button>
      
      <Button 
        type="button" 
        variant="outline"
        className="w-full border-primary text-primary hover:bg-primary/10 py-4 px-6 text-base font-medium"
        disabled
      >
        Historial Médico
        <span className="ml-1 bg-gray-200 text-xs px-1 py-0.5 rounded">Próximamente</span>
      </Button>
    </form>
  );
};

export default PetForm;
