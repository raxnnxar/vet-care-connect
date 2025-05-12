
import React from 'react';
import { Award } from 'lucide-react';
import { EditableSection } from '../EditableSection';
import { CertificationEntry } from '@/features/auth/types/veterinarianTypes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CertificationsSectionProps {
  certifications: CertificationEntry[] | undefined;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications = [],
  isEditing,
  toggleEditing,
  handleSave,
  isLoading
}) => {
  // Format date string to readable format
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <EditableSection
      title="Certificaciones"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {certifications.length === 0 ? (
        <p className="text-gray-500 italic">No hay certificaciones disponibles.</p>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <div key={cert.id} className="border rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Award className="w-5 h-5 text-[#4DA6A8] mr-2" />
                <h3 className="font-medium">{cert.title}</h3>
              </div>
              <div className="pl-7">
                <p className="text-sm text-gray-700">{cert.organization}</p>
                <p className="text-sm text-gray-500">
                  Emitido: {formatDate(cert.issue_date)}
                  {cert.expiry_date && ` · Vence: ${formatDate(cert.expiry_date)}`}
                </p>
                {cert.document_url && (
                  <a 
                    href={cert.document_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline mt-1 inline-block"
                  >
                    Ver certificado
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
            Para gestionar tus certificaciones de manera completa, ve a la sección de "Configuración" y selecciona "Perfil Profesional".
          </p>
        </div>
      )}
    </EditableSection>
  );
};

export default CertificationsSection;
