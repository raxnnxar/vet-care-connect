
import React from 'react';

const VetProfileLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#79D0B8] to-[#5FBFB3] p-4">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white font-medium">Cargando datos del perfil...</p>
    </div>
  );
};

export default VetProfileLoading;
