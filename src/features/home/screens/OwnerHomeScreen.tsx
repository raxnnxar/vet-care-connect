
import React from 'react';
import { Bell } from 'lucide-react';
import VettLogo from '@/ui/atoms/VettLogo';
import { LayoutBase } from '@/frontend/navigation/components';
import { NavbarInferior } from '@/frontend/navigation/components';
import ServiceCategoryGrid from '../components/ServiceCategoryGrid';
import PetFriendlyMap from '../components/PetFriendlyMap';
import VeterinariansMap from '../components/VeterinariansMap';

const OwnerHomeScreen = () => {
  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <VettLogo color="#FFFFFF" height={32} />
          <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
            <Bell size={24} />
          </button>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="flex flex-col gap-6 p-4 pb-20">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar servicios veterinarios..."
            className="w-full px-4 py-2 pl-10 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5FBFB3] focus:border-transparent"
          />
          <span className="absolute inset-y-0 left-3 flex items-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <ServiceCategoryGrid />
        <PetFriendlyMap />
        <VeterinariansMap />
      </div>
    </LayoutBase>
  );
};

export default OwnerHomeScreen;
