
import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/ui/molecules/collapsible';
import { ChevronDown } from 'lucide-react';

interface PetPrimaryVetStatsProps {
  primaryVetCount: number;
  providerType?: 'vet' | 'grooming';
}

const PetPrimaryVetStats: React.FC<PetPrimaryVetStatsProps> = ({ 
  primaryVetCount, 
  providerType = 'vet' 
}) => {
  const [expanded, setExpanded] = useState(false);

  const getProviderText = () => {
    if (providerType === 'grooming') {
      return {
        title: "No es estética de confianza para ninguna mascota",
        selected: `Es estética de confianza para ${primaryVetCount} ${primaryVetCount === 1 ? 'mascota' : 'mascotas'}`,
        description: "La estética de confianza:",
        benefits: [
          "Conoce las preferencias de cuidado de tu mascota",
          "Puede hacer seguimiento a tratamientos estéticos",
          "Recibe notificaciones sobre el historial de grooming"
        ]
      };
    }
    
    return {
      title: "No es veterinario de cabecera para ninguna mascota",
      selected: `Es veterinario de cabecera para ${primaryVetCount} ${primaryVetCount === 1 ? 'mascota' : 'mascotas'}`,
      description: "El veterinario de cabecera:",
      benefits: [
        "Conoce el historial médico completo de tu mascota",
        "Puede hacer seguimiento continuo a tratamientos",
        "Recibe notificaciones cuando hay cambios en la salud de tu mascota"
      ]
    };
  };

  const texts = getProviderText();

  return (
    <Collapsible 
      open={expanded} 
      onOpenChange={setExpanded}
      className="rounded-lg bg-[#F3F9F8] border border-[#79D0B8]/20 p-4"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between cursor-pointer">
          <div>
            <h3 className="font-medium text-gray-800">Estado actual</h3>
            <p className="text-sm text-gray-600">
              {primaryVetCount === 0 ? texts.title : texts.selected}
            </p>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-3">
        <p className="text-sm text-gray-600 mb-1">
          {texts.description}
        </p>
        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
          {texts.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PetPrimaryVetStats;
