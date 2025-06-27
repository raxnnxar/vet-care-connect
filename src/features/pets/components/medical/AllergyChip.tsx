
import React from 'react';
import { Badge } from '@/ui/atoms/badge';
import { X } from 'lucide-react';
import { PetAllergy } from '@/features/pets/types/formTypes';

interface AllergyChipProps {
  allergy: PetAllergy;
  onClick: (allergy: PetAllergy) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

const AllergyChip: React.FC<AllergyChipProps> = ({ 
  allergy, 
  onClick, 
  onDelete,
  showDelete = false 
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(allergy.id);
    }
  };

  return (
    <Badge 
      variant="secondary"
      className="cursor-pointer hover:bg-red-100 text-red-800 bg-red-50 border-red-200 flex items-center gap-1"
      onClick={() => onClick(allergy)}
    >
      <span>{allergy.allergen}</span>
      {showDelete && (
        <button
          onClick={handleDeleteClick}
          className="ml-1 hover:bg-red-200 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

export default AllergyChip;
