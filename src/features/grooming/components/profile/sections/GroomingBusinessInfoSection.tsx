
import React from 'react';
import { Input } from '@/ui/atoms/input';
import { EditableSection } from '@/features/vets/components/profile/EditableSection';

interface GroomingBusinessInfoSectionProps {
  businessName: string;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedBusinessName: string;
  setEditedBusinessName: (name: string) => void;
}

const GroomingBusinessInfoSection: React.FC<GroomingBusinessInfoSectionProps> = ({
  businessName,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedBusinessName,
  setEditedBusinessName
}) => {
  return (
    <EditableSection
      title="Información del Negocio"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del negocio
            </label>
            <Input
              value={editedBusinessName}
              onChange={(e) => setEditedBusinessName(e.target.value)}
              placeholder="Nombre de tu estética canina"
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-600">Nombre del negocio:</span>
            <p className="text-gray-900 mt-1">
              {businessName || 'No especificado'}
            </p>
          </div>
        </div>
      )}
    </EditableSection>
  );
};

export default GroomingBusinessInfoSection;
