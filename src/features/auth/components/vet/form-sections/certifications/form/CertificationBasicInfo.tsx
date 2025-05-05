
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';

interface CertificationBasicInfoProps {
  title: string;
  organization: string;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
}

const CertificationBasicInfo: React.FC<CertificationBasicInfoProps> = ({
  title,
  organization,
  errors,
  onFieldChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">
          Título de la Certificación
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onFieldChange('title', e.target.value)}
          placeholder="Ej. Certificación en Cirugía Avanzada"
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organization">
          Organización
        </Label>
        <Input
          id="organization"
          value={organization}
          onChange={(e) => onFieldChange('organization', e.target.value)}
          placeholder="Ej. Asociación Veterinaria Mexicana"
          className={errors.organization ? "border-red-500" : ""}
        />
        {errors.organization && (
          <p className="text-sm text-red-500">{errors.organization}</p>
        )}
      </div>
    </>
  );
};

export default CertificationBasicInfo;
