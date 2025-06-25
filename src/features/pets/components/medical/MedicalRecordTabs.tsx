
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Badge } from '@/ui/atoms/badge';
import { Pill, Syringe, Stethoscope } from 'lucide-react';
import CurrentMedicationsSection from './CurrentMedicationsSection';
import VaccinationRecordSection from './VaccinationRecordSection';
import MedicalHistorySection from './MedicalHistorySection';

interface MedicalRecordTabsProps {
  petId: string;
  petOwnerId: string;
}

const MedicalRecordTabs: React.FC<MedicalRecordTabsProps> = ({ petId, petOwnerId }) => {
  const [activeMedicationsCount, setActiveMedicationsCount] = useState(0);
  const [vaccinationRecordsCount, setVaccinationRecordsCount] = useState(0);
  const [medicalHistoryCount, setMedicalHistoryCount] = useState(0);

  return (
    <div className="w-full">
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="w-4 h-4" />
            <span className="hidden sm:inline">Medicamentos</span>
            {activeMedicationsCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {activeMedicationsCount}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="vaccination" className="flex items-center gap-2">
            <Syringe className="w-4 h-4" />
            <span className="hidden sm:inline">Vacunas</span>
            {vaccinationRecordsCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {vaccinationRecordsCount}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            <span className="hidden sm:inline">Historial</span>
            {medicalHistoryCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {medicalHistoryCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-6">
          <CurrentMedicationsSection 
            petId={petId} 
            petOwnerId={petOwnerId}
            onCountChange={setActiveMedicationsCount}
          />
        </TabsContent>

        <TabsContent value="vaccination" className="space-y-6">
          <VaccinationRecordSection 
            petId={petId}
            onCountChange={setVaccinationRecordsCount}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <MedicalHistorySection 
            petId={petId}
            onCountChange={setMedicalHistoryCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalRecordTabs;
