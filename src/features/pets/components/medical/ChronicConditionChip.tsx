
import React from 'react';
import { Badge } from '@/ui/atoms/badge';
import { X } from 'lucide-react';
import { PetChronicCondition } from '@/features/pets/types/formTypes';

interface ChronicConditionChipProps {
  condition: PetChronicCondition;
  onClick: (condition: PetChronicCondition) => void;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

const ChronicConditionChip: React.FC<ChronicConditionChipProps> = ({ 
  condition, 
  onClick, 
  onDelete,
  showDelete = false 
}) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(condition.id);
    }
  };

  return (
    <Badge 
      variant="secondary"
      className="cursor-pointer hover:bg-orange-100 text-orange-800 bg-orange-50 border-orange-200 flex items-center gap-1"
      onClick={() => onClick(condition)}
    >
      <span>{condition.condition}</span>
      {showDelete && (
        <button
          onClick={handleDeleteClick}
          className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

export default ChronicConditionChip;
