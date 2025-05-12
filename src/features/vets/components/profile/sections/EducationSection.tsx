
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { EditableSection } from '../EditableSection';
import { EducationEntry } from '@/features/auth/types/veterinarianTypes';
import { format } from 'date-fns';

interface EducationSectionProps {
  educationEntries: EducationEntry[] | undefined;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  educationEntries = [],
  isEditing,
  toggleEditing,
  handleSave,
  isLoading
}) => {
  // Sort education entries by year (most recent first)
  const sortedEducation = [...(educationEntries || [])].sort((a, b) => 
    (b.year || 0) - (a.year || 0)
  );

  return (
    <EditableSection
      title="Educación"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {sortedEducation.length === 0 ? (
        <p className="text-gray-500 italic">No hay información de educación disponible.</p>
      ) : (
        <div className="space-y-4">
          {sortedEducation.map((education) => (
            <div key={education.id} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <GraduationCap className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">{education.degree}</h3>
              </div>
              <div className="pl-7">
                <p className="text-sm text-gray-700">{education.institution}</p>
                <p className="text-sm text-gray-500">{education.year}</p>
                {education.document_url && (
                  <a 
                    href={education.document_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline mt-1 inline-block"
                  >
                    Ver documento
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Para gestionar tu educación de manera completa, ve a la sección de "Configuración" y selecciona "Perfil Profesional".
          </p>
        </div>
      )}
    </EditableSection>
  );
};

export default EducationSection;
