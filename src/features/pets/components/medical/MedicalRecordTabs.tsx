
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { Badge } from '@/ui/atoms/badge';
import { Pill, Syringe, FileText, Stethoscope } from 'lucide-react';
import CurrentMedicationsSection from './CurrentMedicationsSection';
import VaccinationRecordSection from './VaccinationRecordSection';
import MedicalTreatmentsSection from './MedicalTreatmentsSection';
import ClinicalNotesSection from './ClinicalNotesSection';

interface MedicalRecordTabsProps {
  petId: string;
  petOwnerId: string;
}

const MedicalRecordTabs: React.FC<MedicalRecordTabsProps> = ({ petId, petOwnerId }) => {
  const [activeMedicationsCount, setActiveMedicationsCount] = useState(0);
  const [vaccinationRecordsCount, setVaccinationRecordsCount] = useState(0);
  const [treatmentsCount, setTreatmentsCount] = useState(0);
  const [clinicalNotesCount, setClinicalNotesCount] = useState(0);

  return (
    <div className="w-full">
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
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
          
          <TabsTrigger value="treatments" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            <span className="hidden sm:inline">Tratamientos</span>
            {treatmentsCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {treatmentsCount}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Notas</span>
            {clinicalNotesCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {clinicalNotesCount}
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

        <TabsContent value="treatments" className="space-y-6">
          <MedicalTreatmentsSection 
            petId={petId}
            onCountChange={setTreatmentsCount}
          />
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <ClinicalNotesSection 
            petId={petId}
            onCountChange={setClinicalNotesCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalRecordTabs;
