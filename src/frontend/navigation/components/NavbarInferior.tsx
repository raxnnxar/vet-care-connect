
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, MessageSquare, Settings, User } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';
import { cn } from '@/lib/utils';

interface NavbarInferiorProps {
  activeTab?: 'home' | 'appointments' | 'chats' | 'settings' | 'profile';
}

const NavbarInferior: React.FC<NavbarInferiorProps> = ({ activeTab = 'home' }) => {
  return (
    <div className="flex justify-around items-center py-3 px-4 bg-white border-t border-gray-200 shadow-sm fixed bottom-0 left-0 right-0">
      <NavItem 
        icon={<Calendar size={24} />} 
        label="Citas" 
        to={ROUTES.APPOINTMENTS} 
        isActive={activeTab === 'appointments'} 
      />
      <NavItem 
        icon={<Home size={24} />} 
        label="Inicio" 
        to={ROUTES.HOME} 
        isActive={activeTab === 'home'} 
      />
      <NavItem 
        icon={<MessageSquare size={24} />} 
        label="Chats" 
        to={ROUTES.CHATS} 
        isActive={activeTab === 'chats'} 
      />
      <NavItem 
        icon={<Settings size={24} />} 
        label="Ajustes" 
        to={ROUTES.SETTINGS} 
        isActive={activeTab === 'settings'} 
      />
      <NavItem 
        icon={<User size={24} />} 
        label="Perfil" 
        to={ROUTES.PROFILE} 
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
