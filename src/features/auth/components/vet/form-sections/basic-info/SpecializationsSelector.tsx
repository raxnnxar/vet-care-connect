
import React, { useState } from 'react';
import { Label } from '@/ui/atoms/label';
import { AlertCircle, Check, X } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';
import { Button } from '@/ui/atoms/button';
import { cn } from '@/lib/utils';
import { SPECIALIZATIONS } from '@/features/auth/types/veterinarianTypes';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/ui/molecules/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/molecules/popover';
import { useController } from 'react-hook-form';

interface SpecializationsSelectorProps {
  control: any;
  errors: any;
}

const SpecializationsSelector: React.FC<SpecializationsSelectorProps> = ({
  control,
  errors
}) => {
  const [specializationSearchValue, setSpecializationSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  
  const { field: specializationsField } = useController({
    name: 'specializations',
    control,
  });

  // Ensure specializations is always an array
  const specializationsValue = Array.isArray(specializationsField.value) 
    ? specializationsField.value 
    : [];

  const handleSelectSpecialization = (value: string) => {
    const isSelected = specializationsValue.includes(value);
    let newValues: string[];
    
    if (isSelected) {
      newValues = specializationsValue.filter((val: string) => val !== value);
    } else {
      newValues = [...specializationsValue, value];
    }
    
    specializationsField.onChange(newValues);
    setSpecializationSearchValue('');
    // Don't close the popover to allow multiple selections
  };

  const handleRemoveSpecialization = (value: string) => {
    const newValues = specializationsValue.filter((val: string) => val !== value);
    specializationsField.onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="specializations" className="text-base">
        Especializaciones <span className="text-red-500">*</span>
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
            className={cn(
              "w-full justify-between text-left font-normal bg-white",
              !specializationsValue.length && "text-muted-foreground",
              errors.specializations ? "border-red-500" : ""
            )}
          >
            <span>
              {specializationsValue.length
                ? `${specializationsValue.length} especialización${specializationsValue.length > 1 ? 'es' : ''} seleccionada${specializationsValue.length > 1 ? 's' : ''}`
                : "Selecciona especializaciones"}
            </span>
            <span className="ml-2">▼</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto" align="start">
          <Command>
            <CommandInput 
              placeholder="Buscar especialización..." 
              value={specializationSearchValue}
              onValueChange={setSpecializationSearchValue}
              className="border-none focus:ring-0"
            />
            <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
            <CommandGroup className="max-h-[250px] overflow-auto">
              {SPECIALIZATIONS.map((spec) => {
                const isSelected = specializationsValue.includes(spec.value);
                return (
                  <CommandItem
                    key={spec.value}
                    value={spec.value}
                    onSelect={() => handleSelectSpecialization(spec.value)}
                    className="flex items-center gap-2 py-3 cursor-pointer"
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
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      
      {errors.specializations && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {errors.specializations.message}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mt-2">
        {specializationsValue.map((specValue: string) => {
          const spec = SPECIALIZATIONS.find(s => s.value === specValue);
          return (
            <Badge key={specValue} className="py-1 px-3 bg-[#4DA6A8] hover:bg-[#3D8A8C] text-white">
              {spec?.label || specValue}
              <button
                type="button"
                onClick={() => handleRemoveSpecialization(specValue)}
                className="ml-2 rounded-full hover:bg-[#3D8A8C]"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar</span>
              </button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default SpecializationsSelector;
