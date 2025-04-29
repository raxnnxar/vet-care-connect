
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile, ANIMAL_TYPES, LANGUAGES } from '../../../types/veterinarianTypes';
import { Label } from '@/ui/atoms/label';
import { Button } from '@/ui/atoms/button';
import { Check, X } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';
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
import { cn } from '@/lib/utils';

interface AnimalsSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const AnimalsSection: React.FC<AnimalsSectionProps> = ({
  control,
  errors,
}) => {
  const [animalSearchValue, setAnimalSearchValue] = React.useState('');
  const [languageSearchValue, setLanguageSearchValue] = React.useState('');

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Animales y Lenguajes</h2>
        <p className="text-gray-500">
          Indica qué tipos de animales atiendes y qué idiomas hablas para ayudar a los dueños a encontrarte.
        </p>
      </div>

      {/* Animals Treated */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <Label>
            Animales que atiendes <span className="text-red-500">*</span>
          </Label>
          {errors.animals_treated && (
            <p className="text-sm text-red-500">Debes seleccionar al menos un tipo de animal</p>
          )}
        </div>
        
        <Controller
          name="animals_treated"
          control={control}
          render={({ field }) => (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value?.length && "text-muted-foreground",
                      errors.animals_treated && "border-red-500"
                    )}
                  >
                    <span>
                      {field.value?.length
                        ? `${field.value.length} tipo${field.value.length > 1 ? 's' : ''} de animal${field.value.length > 1 ? 'es' : ''} seleccionado${field.value.length > 1 ? 's' : ''}`
                        : "Selecciona los tipos de animales"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Buscar animal..." 
                      value={animalSearchValue}
                      onValueChange={setAnimalSearchValue}
                    />
                    <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {ANIMAL_TYPES.map((animal) => {
                        const isSelected = field.value?.includes(animal.value);
                        return (
                          <CommandItem
                            key={animal.value}
                            onSelect={() => {
                              let newValues: string[];
                              
                              if (isSelected) {
                                newValues = field.value?.filter(
                                  (val: string) => val !== animal.value
                                ) || [];
                              } else {
                                newValues = [...(field.value || []), animal.value];
                              }
                              
                              field.onChange(newValues);
                              setAnimalSearchValue('');
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
                            <span>{animal.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2 mt-3">
                {field.value?.map((animalValue: string) => {
                  const animal = ANIMAL_TYPES.find(a => a.value === animalValue);
                  return (
                    <Badge key={animalValue} variant="secondary" className="py-1">
                      {animal?.label || animalValue}
                      <button
                        type="button"
                        onClick={() => {
                          const newValues = field.value.filter((val: string) => val !== animalValue);
                          field.onChange(newValues);
                        }}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </>
          )}
        />
      </div>

      {/* Languages Spoken */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <Label>
            Idiomas que hablas <span className="text-red-500">*</span>
          </Label>
          {errors.languages_spoken && (
            <p className="text-sm text-red-500">Debes seleccionar al menos un idioma</p>
          )}
        </div>
        
        <Controller
          name="languages_spoken"
          control={control}
          render={({ field }) => (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value?.length && "text-muted-foreground",
                      errors.languages_spoken && "border-red-500"
                    )}
                  >
                    <span>
                      {field.value?.length
                        ? `${field.value.length} idioma${field.value.length > 1 ? 's' : ''} seleccionado${field.value.length > 1 ? 's' : ''}`
                        : "Selecciona idiomas"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Buscar idioma..." 
                      value={languageSearchValue}
                      onValueChange={setLanguageSearchValue}
                    />
                    <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {LANGUAGES.map((language) => {
                        const isSelected = field.value?.includes(language.value);
                        return (
                          <CommandItem
                            key={language.value}
                            onSelect={() => {
                              let newValues: string[];
                              
                              if (isSelected) {
                                newValues = field.value?.filter(
                                  (val: string) => val !== language.value
                                ) || [];
                              } else {
                                newValues = [...(field.value || []), language.value];
                              }
                              
                              field.onChange(newValues);
                              setLanguageSearchValue('');
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
                            <span>{language.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2 mt-3">
                {field.value?.map((langValue: string) => {
                  const language = LANGUAGES.find(l => l.value === langValue);
                  return (
                    <Badge key={langValue} variant="secondary" className="py-1">
                      {language?.label || langValue}
                      <button
                        type="button"
                        onClick={() => {
                          const newValues = field.value.filter((val: string) => val !== langValue);
                          field.onChange(newValues);
                        }}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </>
          )}
        />
      </div>
    </div>
  );
};

export default AnimalsSection;
