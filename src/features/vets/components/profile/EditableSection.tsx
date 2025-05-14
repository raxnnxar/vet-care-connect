
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Edit, Check } from 'lucide-react';

interface EditableSectionProps {
  title: string;
  children: React.ReactNode;
  isEditing: boolean;
  onEdit: () => void;
  onSave?: (() => Promise<void>) | null; // Make onSave optional or null
  isSaving?: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  title,
  children,
  isEditing,
  onEdit,
  onSave,
  isSaving = false
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center gap-1.5 border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
          >
            <Edit className="h-4 w-4" />
            <span>Editar</span>
          </Button>
        ) : onSave && (
          // Only show save button if onSave is provided and not null
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8] hover:text-white"
          >
            <Check className="h-4 w-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
          </Button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};
