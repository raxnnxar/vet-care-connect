
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, MessageSquare, Settings, User } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';
import { cn } from '@/lib/utils';

export type NavTabType = 'home' | 'appointments' | 'chats' | 'settings' | 'profile' | 'pets' | 'search';

interface NavbarInferiorProps {
  activeTab?: NavTabType;
}

const NavbarInferior: React.FC<NavbarInferiorProps> = ({ activeTab = 'home' }) => {
  return (
    <div className="flex justify-around items-center py-3 px-4 bg-white border-t border-gray-200 shadow-sm fixed bottom-0 left-0 right-0">
      <NavItem 
        icon={<Calendar size={24} />} 
        label="Citas" 
        to={ROUTES.OWNER_APPOINTMENTS} 
        isActive={activeTab === 'appointments'} 
      />
      <NavItem 
        icon={<Home size={24} />} 
        label="Inicio" 
        to={ROUTES.OWNER} 
        isActive={activeTab === 'home'} 
      />
      <NavItem 
        icon={<MessageSquare size={24} />} 
        label="Chats" 
        to={ROUTES.OWNER_CHATS || '/owner/chats'} 
        isActive={activeTab === 'chats'} 
      />
      <NavItem 
        icon={<Settings size={24} />} 
        label="Ajustes" 
        to={ROUTES.OWNER_SETTINGS || '/owner/settings'} 
        isActive={activeTab === 'settings'} 
      />
      <NavItem 
        icon={<User size={24} />} 
        label="Perfil" 
        to={ROUTES.OWNER_PROFILE} 
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
