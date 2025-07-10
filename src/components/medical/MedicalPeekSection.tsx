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
  const {
    allergies,
    isLoading: allergiesLoading
  } = usePetAllergies(petId);
  const {
    conditions,
    isLoading: conditionsLoading
  } = usePetChronicConditions(petId);
  const hasData = allergies.length > 0 || conditions.length > 0;
  if (allergiesLoading || conditionsLoading || !hasData) {
    return null;
  }
  return;
};
export default MedicalPeekSection;