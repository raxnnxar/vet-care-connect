
import React from 'react';
import { Button } from '@/ui/atoms/button';

interface ErrorStateProps {
  message: string | null;
  onGoBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onGoBack }) => {
  return (
    <div className="p-4">
      <p>{message || 'No se encontró información del veterinario'}</p>
      <Button onClick={onGoBack} className="mt-4">
        Volver
      </Button>
    </div>
  );
};

export default ErrorState;
