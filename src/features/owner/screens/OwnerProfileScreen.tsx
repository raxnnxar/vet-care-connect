
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { useSelector } from 'react-redux';
import { Button } from '@/ui/atoms/button';
import { Avatar } from '@/ui/atoms/avatar';
import { CalendarDays, Mail, Phone, Settings, User } from 'lucide-react';
import { RootState } from '@/state/store';

const OwnerProfileScreen = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white font-medium text-lg">Mi Perfil</h1>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Settings size={22} />
          </Button>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="flex flex-col p-4 pb-20">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6 bg-white rounded-lg p-6 shadow-sm">
          <Avatar className="h-24 w-24 mb-3">
            {user?.profileImage || user?.profile_picture_url ? (
              <img src={user.profileImage || user.profile_picture_url} alt={user.displayName} />
            ) : (
              <div className="bg-[#5FBFB3] flex items-center justify-center w-full h-full text-white text-2xl">
                {user?.displayName?.charAt(0) || <User size={36} />}
              </div>
            )}
          </Avatar>
          <h2 className="text-xl font-semibold">{user?.displayName || "Usuario"}</h2>
          <p className="text-gray-500">Dueño de mascota</p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-medium mb-4">Información de contacto</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="text-[#5FBFB3]" size={20} />
              <span>{user?.email || "No disponible"}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="text-[#5FBFB3]" size={20} />
              <span>{user?.phone || user?.phone_number || "No disponible"}</span>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-lg font-medium mb-4">Detalles de cuenta</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="text-[#5FBFB3]" size={20} />
              <div>
                <p className="text-gray-500 text-sm">Tipo de usuario</p>
                <p>Dueño de mascota</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CalendarDays className="text-[#5FBFB3]" size={20} />
              <div>
                <p className="text-gray-500 text-sm">Fecha de registro</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-2">
          <Button 
            variant="outline" 
            className="w-full border-[#5FBFB3] text-[#5FBFB3] hover:bg-[#5FBFB3]/10"
          >
            Editar Perfil
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default OwnerProfileScreen;
