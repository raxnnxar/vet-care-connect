
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, MessageSquare, Settings, User, Heart, Search, PawPrint } from 'lucide-react';
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

  return (
    <div className="flex justify-around items-center py-3 px-4 bg-white border-t border-gray-200 shadow-lg fixed bottom-0 left-0 right-0">
      <NavItem 
        icon={<PawPrint size={22} />} 
        label="Mascotas" 
        to={isVetPath ? VET_ROUTES.PATIENTS : ROUTES.OWNER_PETS} 
        isActive={location.pathname.includes('/pets')} 
      />
      <NavItem 
        icon={<Calendar size={22} />} 
        label="Citas" 
        to={isVetPath ? VET_ROUTES.APPOINTMENTS : ROUTES.OWNER_APPOINTMENTS} 
        isActive={location.pathname.includes('/appointments')} 
      />
      <NavItem 
        icon={<Home size={22} />} 
        label="Inicio" 
        to={isVetPath ? VET_ROUTES.DASHBOARD : ROUTES.OWNER_HOME} 
        isActive={
          location.pathname === ROUTES.OWNER_HOME || 
          location.pathname === VET_ROUTES.DASHBOARD ||
          location.pathname === ROUTES.OWNER
        } 
      />
      <NavItem 
        icon={<Heart size={22} />} 
        label="Salud" 
        to={ROUTES.OWNER_SALUD} 
        isActive={location.pathname.includes('/salud')} 
      />
      <NavItem 
        icon={<User size={22} />} 
        label="Perfil" 
        to={isVetPath ? VET_ROUTES.PROFILE : ROUTES.OWNER_PROFILE} 
        isActive={location.pathname.includes('/profile')} 
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
        "flex flex-col items-center relative px-2",
        isActive 
          ? "text-[#79D0B8]" 
          : "text-gray-400 hover:text-gray-600"
      )}
    >
      {isActive && (
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#79D0B8] rounded-full" />
      )}
      <div className={cn(
        "p-1.5 rounded-full", 
        isActive && "bg-[#F0F7F7]"
      )}>
        {icon}
      </div>
      <span className="text-xs mt-1 font-medium">{label}</span>
    </Link>
  );
};

export default NavbarInferior;
