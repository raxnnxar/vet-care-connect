
import React from 'react';
import { Building } from 'lucide-react';

const HospitalesTab: React.FC = () => {
  return (
    <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-dashed border-gray-300">
      <div className="bg-gray-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
        <Building className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-[#1F2937] mb-2">Sección en desarrollo</h3>
      <p className="text-gray-500">La funcionalidad de hospitales estará disponible próximamente</p>
    </div>
  );
};

export default HospitalesTab;
