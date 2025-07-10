import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Badge } from '@/ui/atoms/badge';
import CurrentMedicationsSection from '@/features/pets/components/medical/CurrentMedicationsSection';
import DigitalVaccinationSection from '@/features/pets/components/medical/DigitalVaccinationSection';
import SurgeriesSection from '@/features/pets/components/medical/SurgeriesSection';
import MedicalHistorySection from '@/features/pets/components/medical/MedicalHistorySection';
import PetHeaderCard from '@/features/pets/components/medical/PetHeaderCard';
import { Pet } from '@/features/pets/types';
import { usePetAllergies } from '@/features/pets/hooks/usePetAllergies';
import { usePetChronicConditions } from '@/features/pets/hooks/usePetChronicConditions';
import { usePetSurgeries } from '@/features/pets/hooks/usePetSurgeries';
import { usePetMedications } from '@/features/pets/hooks/usePetMedications';
interface MedicalRecordTabsProps {
  petId: string;
  petOwnerId: string;
  showHeader?: boolean;
}
const MedicalRecordTabs: React.FC<MedicalRecordTabsProps> = ({
  petId,
  petOwnerId,
  showHeader = true
}) => {
  const {
    allergies
  } = usePetAllergies(petId);
  const {
    conditions
  } = usePetChronicConditions(petId);
  const {
    surgeries
  } = usePetSurgeries(petId);
  const {
    medications
  } = usePetMedications(petId);
  const [medicationsCount, setMedicationsCount] = React.useState(0);
  const [historyCount, setHistoryCount] = React.useState(0);

  // Fetch pet data for header
  const [pet, setPet] = React.useState<Pet | null>(null);
  React.useEffect(() => {
    const fetchPet = async () => {
      const {
        supabase
      } = await import('@/integrations/supabase/client');
      const {
        data
      } = await supabase.from('pets').select('*').eq('id', petId).maybeSingle();
      if (data) setPet(data as Pet);
    };
    fetchPet();
  }, [petId]);
  if (!pet) return null;
  return <div className="space-y-0 pb-4">
      {/* Header Card integrado con chips - solo si showHeader es true */}
      {showHeader && <PetHeaderCard pet={pet} />}

      {/* Tabs optimizadas para mobile */}
      <Tabs defaultValue="medications" className="w-full">
        <div className="sticky top-0 bg-gray-50 z-10 border-b border-gray-200">
          <TabsList className="w-full h-auto bg-transparent p-2 gap-1 overflow-x-auto">
            <TabsTrigger value="medications" className="flex-shrink-0 px-3 py-2 text-sm font-medium data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] relative whitespace-nowrap">
              <span>Tratamientos</span>
              {medicationsCount > 0}
            </TabsTrigger>
            
            <TabsTrigger value="vaccines" className="flex-shrink-0 px-3 py-2 text-sm font-medium data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] whitespace-nowrap">
              Vacunas
            </TabsTrigger>
            
            <TabsTrigger value="surgeries" className="flex-shrink-0 px-3 py-2 text-sm font-medium data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] relative whitespace-nowrap">
              <span>Cirugías</span>
              {surgeries.length > 0}
            </TabsTrigger>
            
            <TabsTrigger value="history" className="flex-shrink-0 px-3 py-2 text-sm font-medium data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] relative whitespace-nowrap">
              <span>Historial</span>
              {historyCount > 0}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="medications" className="mt-0 px-4">
          <CurrentMedicationsSection petId={petId} petOwnerId={petOwnerId} onCountChange={setMedicationsCount} />
        </TabsContent>

        <TabsContent value="vaccines" className="mt-0 px-4">
          <DigitalVaccinationSection petId={petId} />
        </TabsContent>

        <TabsContent value="surgeries" className="mt-0 px-4">
          <SurgeriesSection petId={petId} />
        </TabsContent>

        <TabsContent value="history" className="mt-0 px-4">
          <MedicalHistorySection petId={petId} onCountChange={setHistoryCount} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default MedicalRecordTabs;