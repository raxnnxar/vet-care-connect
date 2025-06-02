
import React from 'react';
import { Button } from '@/ui/atoms/button';

interface FinishSetupButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

const FinishSetupButton: React.FC<FinishSetupButtonProps> = ({ 
  onClick, 
  disabled = false,
  text = "Finalizar configuración"
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 bg-white text-[#79D0B8] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-lg font-semibold"
    >
      {text}
    </Button>
  );
};

export default FinishSetupButton;
