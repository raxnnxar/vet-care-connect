
import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';

interface VetContactSectionProps {
  email?: string;
  phone?: string;
  address?: string;
}

const VetContactSection: React.FC<VetContactSectionProps> = ({
  email,
  phone,
  address
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Contacto</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-[#4DA6A8] mr-3" />
            <span className="text-gray-600">
              {address || "Dirección no disponible"}
            </span>
          </div>
          
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-[#4DA6A8] mr-3" />
            <span className="text-gray-600">
              {phone || "Teléfono no disponible"}
            </span>
          </div>
          
          {email && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-[#4DA6A8] mr-3" />
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VetContactSection;
