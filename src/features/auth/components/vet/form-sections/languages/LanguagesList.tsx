
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';
import { LANGUAGES } from '@/features/auth/types/veterinarianTypes';

interface LanguagesListProps {
  selectedLanguages: string[];
  onRemove: (value: string) => void;
}

const LanguagesList: React.FC<LanguagesListProps> = ({ 
  selectedLanguages, 
  onRemove 
}) => {
  // Ensure we're working with an array
  const languages = Array.isArray(selectedLanguages) ? selectedLanguages : [];
  
  if (languages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {languages.map((langValue: string) => {
        // Find the language object in the predefined list
        const language = LANGUAGES.find(l => l.value === langValue);
        
        return (
          <Badge key={langValue} className="py-1 px-3 bg-[#79D0B8] hover:bg-[#5FBFB3]">
            {language?.label || langValue}
            <button
              type="button"
              onClick={() => onRemove(langValue)}
              className="ml-2 rounded-full hover:bg-[#5FBFB3]"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Eliminar</span>
            </button>
          </Badge>
        );
      })}
    </div>
  );
};

export default LanguagesList;
