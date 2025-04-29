
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
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Selecciona los idiomas que hablas para que los dueños de mascotas puedan comunicarse contigo
      </p>
      
      <Controller
        name="languages_spoken"
        control={control}
        render={({ field }) => {
          // Ensure field.value is always an array
          const languagesValue = Array.isArray(field.value) ? field.value : [];
          
          return (
            <>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !languagesValue.length && "text-muted-foreground",
                      errors.languages_spoken && "border-red-500"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(!open);
                    }}
                  >
                    <Languages className="mr-2 h-4 w-4 text-gray-500" />
                    <span>
                      {languagesValue.length
                        ? `${languagesValue.length} idioma${languagesValue.length > 1 ? 's' : ''} seleccionado${languagesValue.length > 1 ? 's' : ''}`
                        : "Selecciona idiomas"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white z-50" align="start">
                  <Command shouldFilter={true}>
                    <CommandInput 
                      placeholder="Buscar idioma..." 
                      value={languageSearchValue}
                      onValueChange={setLanguageSearchValue}
                    />
                    <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {LANGUAGES.map((language) => {
                        const isSelected = languagesValue.includes(language.value);
                        return (
                          <CommandItem
                            key={language.value}
                            value={language.value}
                            onSelect={(value) => {
                              let newValues: string[];
                              
                              if (isSelected) {
                                newValues = languagesValue.filter(
                                  (val: string) => val !== language.value
                                );
                              } else {
                                newValues = [...languagesValue, language.value];
                              }
                              
                              field.onChange(newValues);
                              setLanguageSearchValue('');
                              return false; // Prevent default behavior
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

              {errors.languages_spoken && (
                <p className="text-sm text-red-500 mt-2">Debes seleccionar al menos un idioma</p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {languagesValue.map((langValue: string) => {
                  const language = LANGUAGES.find(l => l.value === langValue);
                  return (
                    <Badge key={langValue} className="py-1 px-3 bg-[#79D0B8] hover:bg-[#5FBFB3]">
                      {language?.label || langValue}
                      <button
                        type="button"
                        onClick={() => {
                          const newValues = languagesValue.filter((val: string) => val !== langValue);
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
          );
        }}
      />
    </div>
  );
};

export default LanguagesSection;
