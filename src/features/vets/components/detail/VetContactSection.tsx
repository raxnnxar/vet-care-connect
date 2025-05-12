
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

interface VetContactSectionProps {
  email: string | null;
}

const VetContactSection: React.FC<VetContactSectionProps> = ({ email }) => {
  return (
    <div className="p-4">
      <h3 className="font-medium text-lg mb-3">Contacto</h3>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <MapPin className="text-[#79D0B8] mr-3" size={20} />
          <span>Dirección no disponible</span>
        </div>
        
        <div className="flex items-center">
          <Phone className="text-[#79D0B8] mr-3" size={20} />
          <span>Teléfono no disponible</span>
        </div>
        
        <div className="flex items-center">
          <Mail className="text-[#79D0B8] mr-3" size={20} />
          <span>{email || "Email no disponible"}</span>
        </div>
      </div>
    </div>
  );
};

export default VetContactSection;
