
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Button } from '@/ui/atoms/button';
import { Check, Languages } from 'lucide-react';
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
import { useLanguageForm } from './useLanguageForm';
import LanguagesList from './LanguagesList';
import { Control } from 'react-hook-form';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';

interface LanguagesSelectorProps {
  control: Control<VeterinarianProfile>;
}

const LanguagesSelector: React.FC<LanguagesSelectorProps> = ({ control }) => {
  const {
    isOpen,
    setIsOpen,
    searchValue,
    setSearchValue,
    languagesValue,
    handleSelectLanguage,
    handleRemoveLanguage,
    allLanguages
  } = useLanguageForm({ control });

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Selecciona los idiomas que hablas para que los dueños de mascotas puedan comunicarse contigo
      </p>
      
      <div className="space-y-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline"
              type="button"
              className={cn(
                "w-full justify-start text-left font-normal",
                !languagesValue.length && "text-muted-foreground"
              )}
            >
              <Languages className="mr-2 h-4 w-4 text-gray-500" />
              <span>
                {languagesValue.length
                  ? `${languagesValue.length} idioma${languagesValue.length > 1 ? 's' : ''} seleccionado${languagesValue.length > 1 ? 's' : ''}`
                  : "Selecciona idiomas (opcional)"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-white z-50" align="start">
            <Command>
              <CommandInput 
                placeholder="Buscar idioma..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {allLanguages.map((language) => {
                  const isSelected = Array.isArray(languagesValue) && languagesValue.includes(language.value);
                  return (
                    <CommandItem
                      key={language.value}
                      value={language.value}
                      onSelect={() => {
                        handleSelectLanguage(language.value);
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

        <LanguagesList 
          selectedLanguages={languagesValue} 
          onRemove={handleRemoveLanguage} 
        />
      </div>
    </div>
  );
};

export default LanguagesSelector;
