
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/ui/molecules/scroll-area';
import MedicalInfoViewer from '@/features/pets/components/medical/MedicalInfoViewer';

interface MedicalHistoryViewerProps {
  pet: any;
  onBack: () => void;
}

const MedicalHistoryViewer: React.FC<MedicalHistoryViewerProps> = ({
  pet,
  onBack
}) => {
  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">
            Historial Médico - {pet.name}
          </h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <ScrollArea className="h-[calc(100vh-140px)]">
        <MedicalInfoViewer pet={pet} />
      </ScrollArea>
    </LayoutBase>
  );
};

export default MedicalHistoryViewer;
