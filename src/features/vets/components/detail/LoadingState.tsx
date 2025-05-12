
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Cargando información del veterinario..." 
}) => {
  return (
    <div className="p-4 flex justify-center items-center h-full">
      <p>{message}</p>
    </div>
  );
};

export default LoadingState;
