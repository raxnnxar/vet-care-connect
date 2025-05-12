
import React from 'react';
import { Stethoscope, User, FileText, AlertCircle, Award, BookOpen } from 'lucide-react';
import { Specialization } from '@/features/auth/types/veterinarianTypes';
import { EditableSection } from '../EditableSection';

interface SpecializationsSectionProps {
  specializations: string[];
  allSpecializations: Specialization[];
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedSpecializations: string[];
  toggleSpecialization: (specialization: string) => void;
}

const getSpecializationIcon = (specialization: string) => {
  switch (specialization) {
    case 'surgery':
      return <Stethoscope className="w-5 h-5 text-[#4DA6A8]" />;
    case 'dermatology':
      return <User className="w-5 h-5 text-[#4DA6A8]" />;
    case 'internal_medicine':
      return <FileText className="w-5 h-5 text-[#4DA6A8]" />;
    case 'cardiology':
      return <AlertCircle className="w-5 h-5 text-[#4DA6A8]" />;
    case 'oncology':
      return <Award className="w-5 h-5 text-[#4DA6A8]" />;
    case 'neurology':
      return <BookOpen className="w-5 h-5 text-[#4DA6A8]" />;
    default:
      return <Award className="w-5 h-5 text-[#4DA6A8]" />;
  }
};

const translateSpecialization = (value: string): string => {
  const specialization = SPECIALIZATIONS.find(spec => spec.value === value);
  return specialization ? specialization.label : value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ');
};

const SpecializationsSection: React.FC<SpecializationsSectionProps> = ({
  specializations,
  allSpecializations,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedSpecializations,
  toggleSpecialization
}) => {
  return (
    <EditableSection
      title="Especialidades"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {!isEditing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {specializations && specializations.length > 0 ? (
            specializations.map((spec) => (
              <div key={spec} className="flex items-center p-3 bg-[#e8f7f3] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                  {getSpecializationIcon(spec)}
                </div>
                <span className="font-medium text-sm">{translateSpecialization(spec)}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-4 col-span-full">
              No hay especialidades registradas
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {allSpecializations.map((spec) => (
            <div 
              key={spec.value}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                editedSpecializations.includes(spec.value) 
                  ? 'bg-[#4DA6A8] text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => toggleSpecialization(spec.value)}
            >
              <div className={`w-8 h-8 rounded-full ${editedSpecializations.includes(spec.value) ? 'bg-white/20' : 'bg-white'} flex items-center justify-center mr-2`}>
                {getSpecializationIcon(spec.value)}
              </div>
              <span className="font-medium text-sm">{spec.label}</span>
            </div>
          ))}
        </div>
      )}
    </EditableSection>
  );
};

// Import directly to avoid circular dependencies
const { SPECIALIZATIONS } = require('@/features/auth/types/veterinarianTypes');

export default SpecializationsSection;
