
import React from 'react';
import { Button } from '@/ui/atoms/button';

export interface FinishSetupButtonProps {
  onClick: () => void;
}

const FinishSetupButton = ({ onClick }: FinishSetupButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] text-white py-3"
    >
      Finalizar configuración
    </Button>
  );
};

export default FinishSetupButton;
