
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Pet } from '@/features/pets/types';

interface NavigationButtonsProps {
  currentStep: number;
  selectedPet: Pet | null;
  selectedService: any;
  selectedDate: Date | null;
  selectedTime: string | null;
  onGoBack: () => void;
  onContinue: () => void;
  isLoading?: boolean;
  canContinue?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  selectedPet,
  selectedService,
  selectedDate,
  selectedTime,
  onGoBack,
  onContinue,
  isLoading = false,
  canContinue
}) => {
  const isDisabled = () => {
    if (canContinue !== undefined) {
      return !canContinue;
    }

    switch (currentStep) {
      case 1:
        return !selectedPet;
      case 2:
        return !selectedService;
      case 3:
        return !selectedDate || !selectedTime;
      default:
        return false;
    }
  };

  return (
    <div className="flex gap-4">
      {currentStep > 1 && (
        <Button 
          variant="outline"
          className="flex-1"
          onClick={onGoBack}
          disabled={isLoading}
        >
          Anterior
        </Button>
      )}
      
      <Button 
        className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
        onClick={onContinue}
        disabled={isDisabled() || isLoading}
      >
        {isLoading ? 'Procesando...' : (currentStep === 4 ? 'Confirmar Cita' : 'Continuar')}
      </Button>
    </div>
  );
};

export default NavigationButtons;
