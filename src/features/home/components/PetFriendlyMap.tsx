
import React from 'react';
import { MapPin } from 'lucide-react';

const PetFriendlyMap = () => {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="bg-[#5FBFB3]/5 p-4">
        <h2 className="text-lg font-semibold mb-2">Todo para tu mascota, cerca de ti</h2>
        <div className="relative bg-gray-100 h-40 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[#5FBFB3] animate-pulse">
              <MapPin size={32} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/80 to-transparent p-4">
            <p className="text-sm text-gray-600 text-center">
              Descubre servicios veterinarios cerca de ti
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetFriendlyMap;
