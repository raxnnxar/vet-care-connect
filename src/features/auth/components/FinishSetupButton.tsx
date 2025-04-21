
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { cn } from '@/lib/utils';

export interface FinishSetupButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const FinishSetupButton = ({ onClick, disabled = false }: FinishSetupButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-3 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
        disabled ? "bg-gray-400" : "bg-[#79D0B8] hover:bg-[#5FBFB3]"
      )}
    >
      Finalizar configuración
    </Button>
  );
};

export default FinishSetupButton;
