
import React, { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/ui/molecules/collapsible';
import { ChevronDown } from 'lucide-react';

interface PetPrimaryVetStatsProps {
  primaryVetCount: number;
}

const PetPrimaryVetStats: React.FC<PetPrimaryVetStatsProps> = ({ primaryVetCount }) => {
  const [expanded, setExpanded] = useState(false);

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
              {primaryVetCount === 0 
                ? "No es veterinario de cabecera para ninguna mascota" 
                : `Es veterinario de cabecera para ${primaryVetCount} ${primaryVetCount === 1 ? 'mascota' : 'mascotas'}`}
            </p>
          </div>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-3">
        <p className="text-sm text-gray-600 mb-1">
          El veterinario de cabecera:
        </p>
        <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
          <li>Conoce el historial médico completo de tu mascota</li>
          <li>Puede hacer seguimiento continuo a tratamientos</li>
          <li>Recibe notificaciones cuando hay cambios en la salud de tu mascota</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PetPrimaryVetStats;
