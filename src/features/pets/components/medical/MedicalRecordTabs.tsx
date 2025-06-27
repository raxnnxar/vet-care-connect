
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Badge } from '@/ui/atoms/badge';
import CurrentMedicationsSection from './CurrentMedicationsSection';
import DigitalVaccinationSection from './DigitalVaccinationSection';
import SurgeriesSection from './SurgeriesSection';
import MedicalHistorySection from './MedicalHistorySection';
import PetHeaderCard from './PetHeaderCard';
import { Pet } from '../../types';
import { usePetAllergies } from '../../hooks/usePetAllergies';
import { usePetChronicConditions } from '../../hooks/usePetChronicConditions';
import { usePetSurgeries } from '../../hooks/usePetSurgeries';
import { usePetMedications } from '../../hooks/usePetMedications';

interface MedicalRecordTabsProps {
  petId: string;
  petOwnerId: string;
}

const MedicalRecordTabs: React.FC<MedicalRecordTabsProps> = ({ petId, petOwnerId }) => {
  const { allergies } = usePetAllergies(petId);
  const { conditions } = usePetChronicConditions(petId);
  const { surgeries } = usePetSurgeries(petId);
  const { medications } = usePetMedications(petId);
  const [medicationsCount, setMedicationsCount] = React.useState(0);
  const [historyCount, setHistoryCount] = React.useState(0);

  // Fetch pet data for header
  const [pet, setPet] = React.useState<Pet | null>(null);

  React.useEffect(() => {
    const fetchPet = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();
      if (data) setPet(data as Pet);
    };
    fetchPet();
  }, [petId]);

  if (!pet) return null;

  return (
    <div className="space-y-0">
      {/* Header Card integrado con chips */}
      <PetHeaderCard pet={pet} />

      {/* Tabs pegados directamente al header */}
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border-b">
          <TabsTrigger 
            value="medications" 
            className="data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] relative"
          >
            Medicamentos
            {medicationsCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-[#79D0B8] text-white text-xs h-5 min-w-5 flex items-center justify-center">
                {medicationsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="vaccines" 
            className="data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8]"
          >
            Vacunas
          </TabsTrigger>
          <TabsTrigger 
            value="surgeries" 
            className="data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] relative"
          >
            Cirugías
            {surgeries.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-[#79D0B8] text-white text-xs h-5 min-w-5 flex items-center justify-center">
                {surgeries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] relative"
          >
            Historial
            {historyCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-[#79D0B8] text-white text-xs h-5 min-w-5 flex items-center justify-center">
                {historyCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-4">
          <CurrentMedicationsSection 
            petId={petId} 
            petOwnerId={petOwnerId}
            onCountChange={setMedicationsCount}
          />
        </TabsContent>

        <TabsContent value="vaccines" className="mt-4">
          <DigitalVaccinationSection petId={petId} />
        </TabsContent>

        <TabsContent value="surgeries" className="mt-4">
          <SurgeriesSection petId={petId} />
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <MedicalHistorySection 
            petId={petId} 
            onCountChange={setHistoryCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalRecordTabs;
