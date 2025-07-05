
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
        <div className="relative h-80 overflow-hidden">
          <img 
            src="/lovable-uploads/0f0767ea-1b64-4af7-be2f-f95987c50c3b.png" 
            alt="Perro amigable"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"></div>
          
          {/* Text overlay */}
          <ServiceCategoryGrid />
        </div>

        {/* Search Bar */}
        <div className="px-4 -mt-6 relative z-10 mb-6">
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
            className="w-full bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-36"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[#91CFC2] w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
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
              className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-40"
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="bg-[#91CFC2] w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-base">Estética</h3>
              </div>
            </button>
            
            <button
              onClick={() => {}}
              className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-40"
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
            className="w-full bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-36"
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center space-x-4">
                <div className="bg-[#91CFC2] w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.169.659 1.591L19.8 14.5M14.25 3.104c.251.023.501.05.75.082M19.8 14.5l-2.436 2.436a2.25 2.25 0 01-1.591.659h-6.546a2.25 2.25 0 01-1.591-.659L5 14.5m14.8 0a3 3 0 01-4.094-1.085A100.375 100.375 0 0012 13.5a100.375 100.375 0 00-3.706.415 3 3 0 01-4.094 1.085m0 0v1.25a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V14.5" />
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
