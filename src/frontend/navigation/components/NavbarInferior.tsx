
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Search, User } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes';

interface NavbarInferiorProps {
  activeTab?: 'home' | 'appointments' | 'vets' | 'profile';
}

const NavbarInferior: React.FC<NavbarInferiorProps> = ({ activeTab = 'home' }) => {
  return (
    <div className="flex justify-around items-center py-3 px-4 bg-white">
      <NavItem 
        icon={<Home size={24} />} 
        label="Home" 
        to={ROUTES.HOME} 
        isActive={activeTab === 'home'} 
      />
      <NavItem 
        icon={<Calendar size={24} />} 
        label="Appointments" 
        to={ROUTES.APPOINTMENTS} 
        isActive={activeTab === 'appointments'} 
      />
      <NavItem 
        icon={<Search size={24} />} 
        label="Find Vets" 
        to={ROUTES.VETS} 
        isActive={activeTab === 'vets'} 
      />
      <NavItem 
        icon={<User size={24} />} 
        label="Profile" 
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
      className={`flex flex-col items-center ${
        isActive ? 'text-blue-600' : 'text-gray-500'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default NavbarInferior;
