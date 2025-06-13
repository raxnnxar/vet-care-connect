
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';
import { Save } from 'lucide-react';

interface PetEditFormData {
  name: string;
  species: string;
  breed: string;
  weight: number | null;
  sex: string;
  temperament: string;
  additional_notes: string;
  age: number | null;
}

interface PetEditFormProps {
  initialData: PetEditFormData;
  onSubmit: (data: PetEditFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const PetEditForm: React.FC<PetEditFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel
}) => {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<PetEditFormData>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Información básica */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">Información básica</h3>
        
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            {...register('name', { required: 'El nombre es obligatorio' })}
            className="mt-1"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="species">Especie *</Label>
            <select
              id="species"
              {...register('species', { required: 'La especie es obligatoria' })}
              className="mt-1 w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Selecciona especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Pez">Pez</option>
              <option value="Conejo">Conejo</option>
              <option value="Hámster">Hámster</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species.message}</p>}
          </div>

          <div>
            <Label htmlFor="breed">Raza</Label>
            <Input
              id="breed"
              {...register('breed')}
              className="mt-1"
              placeholder="Ej: Labrador"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Edad (años)</Label>
            <Input
              id="age"
              type="number"
              {...register('age', { 
                min: { value: 0, message: 'La edad no puede ser negativa' },
                max: { value: 50, message: 'La edad no puede ser mayor a 50 años' }
              })}
              className="mt-1"
              placeholder="Ej: 3"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
          </div>

          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              {...register('weight', { 
                min: { value: 0, message: 'El peso no puede ser negativo' }
              })}
              className="mt-1"
              placeholder="Ej: 15.5"
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="sex">Sexo</Label>
          <select
            id="sex"
            {...register('sex')}
            className="mt-1 w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Selecciona sexo</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        <div>
          <Label htmlFor="temperament">Temperamento</Label>
          <Input
            id="temperament"
            {...register('temperament')}
            className="mt-1"
            placeholder="Ej: Tranquilo, juguetón"
          />
        </div>

        <div>
          <Label htmlFor="additional_notes">Notas adicionales</Label>
          <Textarea
            id="additional_notes"
            {...register('additional_notes')}
            className="mt-1"
            placeholder="Información adicional sobre tu mascota..."
            rows={3}
          />
        </div>
      </Card>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save size={16} />
              Guardar cambios
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default PetEditForm;
