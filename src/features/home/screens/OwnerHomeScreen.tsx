import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Scissors, Pill } from 'lucide-react';
import VettLogo from '@/ui/atoms/VettLogo';
import { LayoutBase } from '@/frontend/navigation/components';
import { NavbarInferior } from '@/frontend/navigation/components';
import ServiceCategoryGrid from '../components/ServiceCategoryGrid';
import { useAppLocationUpdate } from '@/features/settings/hooks/useAppLocationUpdate';
const OwnerHomeScreen = () => {
  const navigate = useNavigate();

  // Update location on app start if user has location sharing enabled
  useAppLocationUpdate();
  const handleSaludClick = () => {
    navigate('/owner/salud');
  };
  const handleEsteticaClick = () => {
    navigate('/owner/estetica');
  };
  const handleCercaDeTiClick = () => {
    navigate('/owner/find-vets');
  };
  const handleTratamientosClick = () => {
    navigate('/owner/treatments');
  };
  return <LayoutBase header={<div className="flex justify-between items-center px-4 py-3 bg-[#79d0b8]">
          <VettLogo color="#FFFFFF" height={32} />
          <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <Bell size={24} />
          </button>
        </div>} footer={<NavbarInferior activeTab="home" />}>
      <div className="flex flex-col min-h-full bg-[#F9FAFB]">
        {/* Hero Banner with Dog Image - More rectangular */}
        <div className="relative h-44 overflow-hidden">
          <img src="/lovable-uploads/0f0767ea-1b64-4af7-be2f-f95987c50c3b.png" alt="Perro amigable" className="w-full h-full object-cover object-center" />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"></div>
          
          {/* Text overlay */}
          <ServiceCategoryGrid />
        </div>

        {/* Search Bar */}
        <div className="px-4 -mt-4 relative z-10 mb-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative">
            <input 
              type="text" 
              placeholder="Buscar servicios veterinarios..." 
              className="w-full px-4 py-3 pl-12 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91CFC2] focus:border-transparent text-gray-700 placeholder-gray-500 mobile-touch-target" 
            />
            <span className="absolute inset-y-0 left-4 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Service Modules - Optimized heights and spacing */}
        <div className="px-4 pb-20 space-y-3">
          {/* Full width - Salud */}
          <button onClick={handleSaludClick} className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] mobile-touch-target min-h-[80px]">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[#91CFC2] w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-base mb-1">Salud</h3>
                  <p className="text-gray-600 text-sm">Veterinarios y urgencias</p>
                </div>
              </div>
            </div>
          </button>

          {/* Half width row - Estética and Cerca de ti */}
          <div className="flex gap-3">
            <button onClick={handleEsteticaClick} className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] mobile-touch-target min-h-[100px]">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-[#91CFC2] w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-2">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Estética</h3>
              </div>
            </button>
            
            <button onClick={handleCercaDeTiClick} className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] mobile-touch-target min-h-[100px]">
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-[#91CFC2] w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-2">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">Cerca de ti</h3>
              </div>
            </button>
          </div>

          {/* Full width - Tratamientos */}
          <button onClick={handleTratamientosClick} className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] mobile-touch-target min-h-[80px]">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[#91CFC2] w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-base mb-1">Tratamientos</h3>
                  <p className="text-gray-600 text-sm">Gestiona medicación y cuidados</p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </LayoutBase>;
};
export default OwnerHomeScreen;