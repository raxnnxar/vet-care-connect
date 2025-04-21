
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';

const FindVetsScreen = () => {
  const navigate = useNavigate();

  const handleViewVet = (vetId: string) => {
    navigate(`/owner/vets/${vetId}`);
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white text-xl font-semibold">Buscar Veterinarios</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o especialidad..."
            className="w-full px-4 py-2 pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5FBFB3] focus:border-transparent"
          />
          <span className="absolute inset-y-0 left-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        <h2 className="text-lg font-semibold mb-4">Veterinarios Cercanos</h2>
        
        {/* Demo veterinarian card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Dr. Carlos Rodríguez</h3>
              <p className="text-sm text-gray-500">Medicina General</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">★★★★☆</span>
                <span className="text-xs text-gray-500 ml-1">(4.2)</span>
              </div>
            </div>
            <Button size="sm" onClick={() => handleViewVet("123")}>Ver Perfil</Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Dra. Ana Martínez</h3>
              <p className="text-sm text-gray-500">Cirugía</p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-xs text-gray-500 ml-1">(4.9)</span>
              </div>
            </div>
            <Button size="sm" onClick={() => handleViewVet("456")}>Ver Perfil</Button>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default FindVetsScreen;
