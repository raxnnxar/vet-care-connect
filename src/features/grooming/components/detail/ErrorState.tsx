
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface ErrorStateProps {
  message?: string | null;
  onGoBack?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onGoBack }) => {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        No se pudo cargar la información
      </h2>
      <p className="text-gray-500 mb-6">
        {message || 'Ocurrió un error al cargar los detalles de la estética'}
      </p>
      <Button onClick={handleGoBack} className="bg-[#79D0B8] hover:bg-[#4DA6A8]">
        Volver
      </Button>
    </div>
  );
};

export default ErrorState;
