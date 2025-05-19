
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { usePrimaryVet } from '@/features/health/hooks/usePrimaryVet';

interface VetActionButtonsProps {
  onBookAppointment: () => void;
  vetId: string;
}

const VetActionButtons: React.FC<VetActionButtonsProps> = ({
  onBookAppointment,
  vetId
}) => {
  const { setAsPRIMARY, loading } = usePrimaryVet();

  const handleSetAsPrimary = async () => {
    await setAsPRIMARY(vetId);
  };

  return (
    <div className="fixed bottom-20 left-0 right-0 p-4 bg-white shadow-md border-t border-gray-200 z-10">
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        <Button 
          onClick={onBookAppointment}
          className="w-full bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-md rounded-lg"
        >
          Agendar cita
        </Button>
        
        <Button 
          onClick={handleSetAsPrimary}
          variant="outline"
          className="w-full border-[#79D0B8] text-[#4DA6A8] hover:bg-[#F0F9F6] rounded-lg"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Establecer como Veterinario de Cabecera'}
        </Button>
      </div>
    </div>
  );
};

export default VetActionButtons;
