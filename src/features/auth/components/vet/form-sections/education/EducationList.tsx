
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import EducationCard from './EducationCard';
import { EducationEntry } from '../../../../types/veterinarianTypes';

interface EducationListProps {
  fields: Array<EducationEntry>;
  onAddClick: () => void;
  onRemove: (index: number) => void;
  onUpload: (educationId: string, file: File) => void;
  isUploading: Record<string, boolean>;
  control: any;
}

const EducationList: React.FC<EducationListProps> = ({
  fields,
  onAddClick,
  onRemove,
  onUpload,
  isUploading,
  control
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {fields.map((field, index) => (
          <EducationCard
            key={field.id}
            education={field}
            index={index}
            isUploading={!!isUploading[field.id]}
            onDelete={() => onRemove(index)}
            onUpload={(file) => onUpload(field.id, file)}
            control={control}
          />
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button 
          type="button" 
          onClick={onAddClick} 
          variant="outline"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Formación
        </Button>
      </div>
    </>
  );
};

export default EducationList;
