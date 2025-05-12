
import React from 'react';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CertificationEntry {
  id: string;
  title: string;
  organization: string;
  issue_date: string;
  expiry_date?: string;
  document_url?: string;
}

interface VetCertificationsSectionProps {
  certifications: CertificationEntry[];
}

const VetCertificationsSection: React.FC<VetCertificationsSectionProps> = ({ certifications }) => {
  // Format date string to readable format
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  if (certifications.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Award className="mr-2 h-5 w-5 text-[#4DA6A8]" />
          Certificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {certifications.map((cert) => (
          <div key={cert.id} className="py-3 border-b last:border-0">
            <div className="flex flex-col">
              <span className="font-medium">{cert.title}</span>
              <div className="flex justify-between text-sm flex-wrap">
                <span className="text-gray-600">{cert.organization}</span>
                <span className="text-gray-500">
                  {formatDate(cert.issue_date)}
                  {cert.expiry_date && ` - ${formatDate(cert.expiry_date)}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VetCertificationsSection;
