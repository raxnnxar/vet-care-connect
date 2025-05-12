
import React from 'react';
import { PenSquare, Save } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface EditableSectionProps {
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  isSaving: boolean;
  children: React.ReactNode;
}

export const EditableSection: React.FC<EditableSectionProps> = ({ 
  title, 
  isEditing, 
  onEdit, 
  onSave, 
  isSaving,
  children 
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <PenSquare className="h-4 w-4 mr-1" />
            Editar
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={onSave}
            disabled={isSaving}
            className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white"
          >
            {isSaving ? (
              <span className="flex items-center">
                <div className="animate-spin mr-1 h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                Guardando...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Guardar
              </>
            )}
          </Button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};
