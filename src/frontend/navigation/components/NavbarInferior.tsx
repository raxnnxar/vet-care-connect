
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageSquare, Settings, User } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';
import { cn } from '@/lib/utils';
import { VET_ROUTES } from '@/navigation/navigationConfig';

export type NavTabType = 'home' | 'appointments' | 'chats' | 'settings' | 'profile' | 'pets' | 'search' | 'schedule';

interface NavbarInferiorProps {
  activeTab?: NavTabType;
}

const NavbarInferior: React.FC<NavbarInferiorProps> = ({ activeTab = 'home' }) => {
  const location = useLocation();
  
  // Get the current path to determine if we're in the vet or grooming section
  const isVetPath = location.pathname.includes('/vet');
  const isGroomingPath = location.pathname.includes('/grooming');
  
  // Create the proper styling for the nav bar to ensure it doesn't overlap with content
  return (
    <div className="flex justify-around items-center py-4 px-2 bg-white border-t border-gray-200 shadow-md fixed bottom-0 left-0 right-0 z-20 min-h-[64px]">
      <NavItem 
        icon={<Calendar size={24} />} 
        label="Citas" 
        to={isVetPath ? VET_ROUTES.APPOINTMENTS : isGroomingPath ? '/grooming/appointments' : ROUTES.OWNER_APPOINTMENTS || '/owner/appointments'} 
        isActive={activeTab === 'appointments'} 
      />
      <NavItem 
        icon={<Home size={24} />} 
        label="Inicio" 
        to={isVetPath ? VET_ROUTES.DASHBOARD : isGroomingPath ? '/grooming' : ROUTES.OWNER} 
        isActive={activeTab === 'home'} 
      />
      <NavItem 
        icon={<MessageSquare size={24} />} 
        label="Chats" 
        to={isVetPath ? '/vet/chats' : isGroomingPath ? '/grooming/chats' : '/owner/chats'} 
        isActive={activeTab === 'chats'} 
      />
      <NavItem 
        icon={<Settings size={24} />} 
        label="Ajustes" 
        to={isVetPath ? VET_ROUTES.SETTINGS : isGroomingPath ? '/grooming/settings' : ROUTES.OWNER_SETTINGS || '/owner/settings'} 
        isActive={activeTab === 'settings'} 
      />
      <NavItem 
        icon={<User size={24} />} 
        label="Perfil" 
        to={isVetPath ? '/vet/profile' : isGroomingPath ? '/grooming/profile' : ROUTES.OWNER_PROFILE} 
        isActive={activeTab === 'profile'} 
      />
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center mobile-touch-target min-w-[60px] py-2 px-1 rounded-lg transition-colors",
        isActive ? "text-primary bg-primary/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      {icon}
      <span className="text-xs mt-1 text-center leading-tight">{label}</span>
    </Link>
  );
};

export default NavbarInferior;
