
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
  const specializationsValue = Array.isArray(specializationsField.value) ? specializationsField.value : [];

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
            className={cn(
              "w-full justify-start text-left font-normal",
              !specializationsValue.length && "text-muted-foreground",
              errors.specializations ? "border-red-500" : ""
            )}
          >
            <span>
              {specializationsValue.length
                ? `${specializationsValue.length} especialización${specializationsValue.length > 1 ? 'es' : ''} seleccionada${specializationsValue.length > 1 ? 's' : ''}`
                : "Selecciona especializaciones"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Buscar especialización..." 
              value={specializationSearchValue}
              onValueChange={setSpecializationSearchValue}
            />
            <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {SPECIALIZATIONS.map((spec) => {
                const isSelected = specializationsValue.includes(spec.value);
                return (
                  <CommandItem
                    key={spec.value}
                    onSelect={() => {
                      let newValues: string[] = [];
                      
                      if (isSelected) {
                        newValues = specializationsValue.filter(
                          (val: string) => val !== spec.value
                        );
                      } else {
                        newValues = [...specializationsValue, spec.value];
                      }
                      
                      specializationsField.onChange(newValues);
                      setSpecializationSearchValue('');
                    }}
                  >
                    <div 
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
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
                onClick={() => {
                  const newValues = specializationsValue.filter((val: string) => val !== specValue);
                  specializationsField.onChange(newValues);
                }}
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
