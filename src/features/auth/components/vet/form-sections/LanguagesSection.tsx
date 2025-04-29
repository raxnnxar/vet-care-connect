
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile, LANGUAGES } from '../../../types/veterinarianTypes';
import { Label } from '@/ui/atoms/label';
import { Button } from '@/ui/atoms/button';
import { Check, X, Languages } from 'lucide-react';
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

interface LanguagesSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  control,
  errors,
}) => {
  const [languageSearchValue, setLanguageSearchValue] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-baseline">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Idiomas</h3>
          <p className="text-gray-500 text-sm mt-1">
            Selecciona los idiomas que hablas para que los dueños de mascotas puedan comunicarse contigo
          </p>
        </div>
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
                  <Languages className="mr-2 h-4 w-4 text-gray-500" />
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

            <div className="flex flex-wrap gap-2 mt-4">
              {field.value?.map((langValue: string) => {
                const language = LANGUAGES.find(l => l.value === langValue);
                return (
                  <Badge key={langValue} className="py-1 px-3 bg-[#79D0B8] hover:bg-[#5FBFB3]">
                    {language?.label || langValue}
                    <button
                      type="button"
                      onClick={() => {
                        const newValues = field.value.filter((val: string) => val !== langValue);
                        field.onChange(newValues);
                      }}
                      className="ml-2 rounded-full hover:bg-[#5FBFB3]"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Eliminar</span>
                    </button>
                  </Badge>
                );
              })}
            </div>
          </>
        )}
      />
    </div>
  );
};

export default LanguagesSection;
