
import React from 'react';
import { Calendar, Globe } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';
import { EditableSection } from '../EditableSection';
import { Textarea } from '@/ui/atoms/textarea';

interface PersonalInfoSectionProps {
  bio: string;
  yearsOfExperience: number;
  languagesSpoken: string[];
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedBio: string;
  setEditedBio: (bio: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  bio,
  yearsOfExperience,
  languagesSpoken,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedBio,
  setEditedBio
}) => {
  return (
    <EditableSection
      title="Información Personal"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {!isEditing ? (
        <div className="prose">
          <div className="flex items-center gap-2 mb-4 text-gray-700">
            <Calendar className="w-5 h-5 text-[#4DA6A8]" />
            <span>{yearsOfExperience || 0} años de experiencia</span>
          </div>
          
          <p className="text-gray-700 whitespace-pre-wrap">{bio || 'Sin biografía'}</p>
          
          {languagesSpoken && languagesSpoken.length > 0 && (
            <div className="mt-4">
              <h3 className="flex items-center text-lg font-medium mb-2">
                <Globe className="w-5 h-5 mr-2 text-[#4DA6A8]" /> 
                Idiomas:
              </h3>
              <div className="flex flex-wrap gap-2">
                {languagesSpoken.map((language) => (
                  <Badge key={language} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <Textarea 
              value={editedBio} 
              onChange={(e) => setEditedBio(e.target.value)}
              placeholder="Cuéntanos sobre ti y tu experiencia como veterinario..."
              className="min-h-[120px]"
            />
          </div>
        </div>
      )}
    </EditableSection>
  );
};

export default PersonalInfoSection;
