
import React, { useState } from 'react';
import { Card, CardContent } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { ChevronDown, ChevronRight, AlertTriangle, Heart } from 'lucide-react';
import { usePetAllergies } from '@/features/pets/hooks/usePetAllergies';
import { usePetChronicConditions } from '@/features/pets/hooks/usePetChronicConditions';

interface MedicalPeekSectionProps {
  petId: string;
  onViewFullMedical: () => void;
}

const MedicalPeekSection: React.FC<MedicalPeekSectionProps> = ({ 
  petId, 
  onViewFullMedical 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { allergies, isLoading: allergiesLoading } = usePetAllergies(petId);
  const { conditions, isLoading: conditionsLoading } = usePetChronicConditions(petId);

  const hasData = allergies.length > 0 || conditions.length > 0;

  if (allergiesLoading || conditionsLoading || !hasData) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-orange-400">
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-orange-500" />
            <span className="font-medium text-gray-700">Información médica importante</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </div>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {allergies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Alergias:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewFullMedical();
                    }}
                    className="text-[#79D0B8] hover:text-[#5FBFB3] text-sm"
                  >
                    Ver más ▶
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {allergies.slice(0, 3).map((allergy) => (
                    <Badge key={allergy.id} variant="outline" className="text-red-600 border-red-300 text-xs">
                      {allergy.allergen}
                    </Badge>
                  ))}
                  {allergies.length > 3 && (
                    <Badge variant="outline" className="text-gray-500 text-xs">
                      +{allergies.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {conditions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Condiciones crónicas:</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewFullMedical();
                    }}
                    className="text-[#79D0B8] hover:text-[#5FBFB3] text-sm"
                  >
                    Ver más ▶
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {conditions.slice(0, 3).map((condition) => (
                    <Badge key={condition.id} variant="outline" className="text-blue-600 border-blue-300 text-xs">
                      {condition.condition}
                    </Badge>
                  ))}
                  {conditions.length > 3 && (
                    <Badge variant="outline" className="text-gray-500 text-xs">
                      +{conditions.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalPeekSection;
