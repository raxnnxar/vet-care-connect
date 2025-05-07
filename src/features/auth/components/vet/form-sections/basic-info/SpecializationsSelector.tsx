
import React, { useState, useEffect } from 'react';
import { Label } from '@/ui/atoms/label';
import { AlertCircle, Check, X, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';
import { Button } from '@/ui/atoms/button';
import { cn } from '@/lib/utils';
import { SPECIALIZATIONS } from '@/features/auth/types/veterinarianTypes';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/molecules/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/molecules/dropdown-menu';
import { useController } from 'react-hook-form';

interface SpecializationsSelectorProps {
  control: any;
  errors: any;
}

const SpecializationsSelector: React.FC<SpecializationsSelectorProps> = ({
  control,
  errors
}) => {
  const [open, setOpen] = useState(false);
  
  // Usar useController para manejar el campo de formulario
  const { field } = useController({
    name: 'specializations',
    control,
    // Asegurar que siempre tenemos un array como valor predeterminado
    defaultValue: [],
  });

  // Asegurar que specializationsValue siempre sea un array válido
  const specializationsValue = Array.isArray(field.value) 
    ? field.value 
    : [];

  // Al montar el componente, asegurar que tenemos un valor de array válido
  useEffect(() => {
    if (!Array.isArray(field.value)) {
      field.onChange([]);
    }
  }, [field]);

  const handleSelectSpecialization = (value: string) => {
    // Solo continuar si el valor es una cadena no vacía
    if (!value?.trim()) return;
    
    // Verificar si ya está seleccionado
    const isSelected = specializationsValue.includes(value);
    let newValues: string[];
    
    if (isSelected) {
      // Eliminar el valor si ya está seleccionado
      newValues = specializationsValue.filter((val: string) => val !== value);
    } else {
      // Agregar el valor si no está seleccionado
      newValues = [...specializationsValue, value];
    }
    
    // Actualizar el valor del campo
    field.onChange(newValues);
  };

  const handleRemoveSpecialization = (value: string) => {
    // Solo continuar si el valor es una cadena no vacía
    if (!value?.trim()) return;
    
    const newValues = specializationsValue.filter((val: string) => val !== value);
    field.onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="specializations" className="text-base">
        Especializaciones
      </Label>
      <p className="text-sm text-gray-500">
        Selecciona todas las especializaciones que apliquen a tu práctica veterinaria
      </p>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox"
            aria-expanded={open}
            type="button" // Explícitamente definir como botón para evitar envío del formulario
            className={cn(
              "w-full justify-between text-left font-normal bg-white",
              !specializationsValue.length && "text-muted-foreground",
              errors?.specializations ? "border-red-500" : ""
            )}
          >
            <span>
              {specializationsValue.length
                ? `${specializationsValue.length} especialización${specializationsValue.length > 1 ? 'es' : ''} seleccionada${specializationsValue.length > 1 ? 's' : ''}`
                : "Selecciona especializaciones"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto bg-white z-50" align="start">
          <div className="p-2">
            <div className="space-y-2">
              {SPECIALIZATIONS.map((spec) => {
                const isSelected = specializationsValue.includes(spec.value);
                return (
                  <div 
                    key={spec.value}
                    className={cn(
                      "flex items-center space-x-2 rounded-md p-2",
                      isSelected ? "bg-accent" : "hover:bg-muted cursor-pointer"
                    )}
                    onClick={() => handleSelectSpecialization(spec.value)}
                  >
                    <div 
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{spec.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {errors?.specializations && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errors.specializations.message}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {specializationsValue.map((specValue: string) => {
          const spec = SPECIALIZATIONS.find(s => s.value === specValue);
          return spec ? (
            <Badge key={specValue} className="py-1 px-3 bg-[#4DA6A8] hover:bg-[#3D8A8C] text-white">
              {spec.label || specValue}
              <button
                type="button"
                onClick={() => handleRemoveSpecialization(specValue)}
                className="ml-2 rounded-full hover:bg-[#3D8A8C]"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar</span>
              </button>
            </Badge>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default SpecializationsSelector;
