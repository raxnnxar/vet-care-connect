
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
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        {/* Hero Banner with Dog Image */}
        <div className="relative h-32 overflow-hidden">
          <img 
            src="/lovable-uploads/aff64c25-ce5f-49be-b091-39c5eaa9e165.png" 
            alt="Perro amigable"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>

        <div className="flex-1 px-4 pb-20 -mt-4">
          {/* Search Bar */}
          <div className="relative mb-4 bg-white rounded-lg shadow-sm">
            <input 
              type="text" 
              placeholder="Buscar servicios veterinarios..." 
              className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#91CFC2] focus:border-transparent" 
            />
            <span className="absolute inset-y-0 left-3 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>

          <ServiceCategoryGrid />
        </div>
      </div>
    </LayoutBase>
  );
};

export default OwnerHomeScreen;
