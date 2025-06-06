
import React from 'react';
import { MapPin } from 'lucide-react';
import { EditableSection } from '@/features/vets/components/profile/EditableSection';

interface GroomingLocationSectionProps {
  location: string;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedLocation: string;
  setEditedLocation: (location: string) => void;
}

const GroomingLocationSection: React.FC<GroomingLocationSectionProps> = ({
  location,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedLocation,
  setEditedLocation
}) => {
  return (
    <EditableSection
      title="Ubicación"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
            placeholder="Dirección completa de la estética"
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {location ? (
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-[#79D0B8] mt-1" />
              <p className="text-gray-700 flex-1">{location}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay ubicación registrada</p>
          )}
        </div>
      )}
    </EditableSection>
  );
};

export default GroomingLocationSection;
