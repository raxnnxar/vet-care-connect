
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageSquare, Settings, User } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';
import { cn } from '@/lib/utils';
import { VET_ROUTES } from '@/navigation/navigationConfig';

export type NavTabType = 'home' | 'appointments' | 'chats' | 'settings' | 'profile' | 'pets' | 'search';

interface NavbarInferiorProps {
  activeTab?: NavTabType;
}

const NavbarInferior: React.FC<NavbarInferiorProps> = ({ activeTab = 'home' }) => {
  const location = useLocation();
  
  // Get the current path to determine if we're in the vet section
  const isVetPath = location.pathname.includes('/vet');
  
  // Create the proper styling for the nav bar to ensure it doesn't overlap with content
  return (
    <div className="flex justify-around items-center py-3 px-4 bg-white border-t border-gray-200 shadow-md fixed bottom-0 left-0 right-0 z-20">
      <NavItem 
        icon={<Calendar size={24} />} 
        label="Citas" 
        to={isVetPath ? VET_ROUTES.APPOINTMENTS : ROUTES.OWNER_APPOINTMENTS || '/owner/appointments'} 
        isActive={activeTab === 'appointments'} 
      />
      <NavItem 
        icon={<Home size={24} />} 
        label="Inicio" 
        to={isVetPath ? VET_ROUTES.DASHBOARD : ROUTES.OWNER} 
        isActive={activeTab === 'home'} 
      />
      <NavItem 
        icon={<MessageSquare size={24} />} 
        label="Chats" 
        to={isVetPath ? '/vet/chats' : '/owner/chats'} 
        isActive={activeTab === 'chats'} 
      />
      <NavItem 
        icon={<Settings size={24} />} 
        label="Ajustes" 
        to={isVetPath ? VET_ROUTES.SETTINGS : ROUTES.OWNER_SETTINGS || '/owner/settings'} 
        isActive={activeTab === 'settings'} 
      />
      <NavItem 
        icon={<User size={24} />} 
        label="Perfil" 
        to={isVetPath ? '/vet/profile' : ROUTES.OWNER_PROFILE} 
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
        "flex flex-col items-center",
        isActive ? "text-primary" : "text-gray-500"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default NavbarInferior;
