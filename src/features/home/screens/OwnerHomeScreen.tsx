
import React from 'react';
import { Bell } from 'lucide-react';
import VettLogo from '@/ui/atoms/VettLogo';
import { LayoutBase } from '@/frontend/navigation/components';
import { NavbarInferior } from '@/frontend/navigation/components';
import ServiceCategoryGrid from '../components/ServiceCategoryGrid';
import { useAppLocationUpdate } from '@/features/settings/hooks/useAppLocationUpdate';

const OwnerHomeScreen = () => {
  // Update location on app start if user has location sharing enabled
  useAppLocationUpdate();
  
  return (
    <LayoutBase 
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#79d0b8]">
          <VettLogo color="#FFFFFF" height={32} />
          <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <Bell size={24} />
          </button>
        </div>
      } 
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="flex flex-col min-h-full bg-[#F9FAFB]">
        {/* Hero Banner with Dog Image */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src="/lovable-uploads/aff64c25-ce5f-49be-b091-39c5eaa9e165.png" 
            alt="Perro amigable"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
          
          {/* Text overlay */}
          <ServiceCategoryGrid />
        </div>

        {/* Search Bar */}
        <div className="px-4 -mt-8 relative z-10 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <input 
              type="text" 
              placeholder="Buscar servicios veterinarios..." 
              className="w-full px-4 py-3.5 pl-12 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#91CFC2] focus:border-transparent text-gray-700 placeholder-gray-500" 
            />
            <span className="absolute inset-y-0 left-4 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Service Modules */}
        <div className="px-4 pb-24 space-y-4">
          {/* Full width - Salud */}
          <button
            onClick={() => {}}
            className="w-full bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-32"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[#91CFC2] w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443a55.381 55.381 0 015.25 2.882V15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-xl mb-1">Salud</h3>
                  <p className="text-gray-600 text-sm">Veterinarios y urgencias</p>
                </div>
              </div>
            </div>
          </button>

          {/* Half width row - Estética and Cerca de ti */}
          <div className="flex gap-4">
            <button
              onClick={() => {}}
              className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-36"
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-[#91CFC2] w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-9.02a4.5 4.5 0 105.2 8.656m2.227-4.993c0 .690.56 1.25 1.25 1.25s1.25-.56 1.25-1.25-.56-1.25-1.25-1.25-1.25.56-1.25 1.25z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-base">Estética</h3>
              </div>
            </button>
            
            <button
              onClick={() => {}}
              className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-36"
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-[#91CFC2] w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-base">Cerca de ti</h3>
              </div>
            </button>
          </div>

          {/* Full width - Tratamientos */}
          <button
            onClick={() => {}}
            className="w-full bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-32"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[#91CFC2] w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-xl mb-1">Tratamientos</h3>
                  <p className="text-gray-600 text-sm">Gestiona medicación y cuidados</p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default OwnerHomeScreen;
