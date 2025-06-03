
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { ChevronRight, Moon, Bell, Lock, HelpCircle, LifeBuoy, LogOut, Globe, Palette, MapPin } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Switch } from '@/ui/atoms/switch';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useLocationSharing } from '../hooks/useLocationSharing';

const SettingItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}> = ({ icon, title, description, onClick, rightElement }) => {
  return (
    <Button 
      variant="ghost" 
      className="w-full flex items-center justify-between p-3 h-auto"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-gray-100 mr-3">
          {icon}
        </div>
        <div className="text-left">
          <h3 className="font-medium text-base">{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      {rightElement || <ChevronRight className="h-5 w-5 text-gray-400" />}
    </Button>
  );
};

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { userRole } = useUser();
  const { shareLocation, isLoading, updateLocationSharing } = useLocationSharing();

  const handleLocationSharingToggle = async () => {
    if (isLoading) return;
    await updateLocationSharing(!shareLocation);
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white font-medium text-lg">Configuración</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20 space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50">
            <h2 className="font-medium">Apariencia</h2>
          </div>
          <div className="divide-y">
            <SettingItem
              icon={<Moon className="h-5 w-5 text-[#5FBFB3]" />}
              title="Modo oscuro"
              rightElement={<Switch />}
            />
            <SettingItem
              icon={<Palette className="h-5 w-5 text-[#5FBFB3]" />}
              title="Tema"
              description="Personaliza los colores de la app"
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50">
            <h2 className="font-medium">Notificaciones</h2>
          </div>
          <div className="divide-y">
            <SettingItem
              icon={<Bell className="h-5 w-5 text-[#5FBFB3]" />}
              title="Notificaciones push"
              rightElement={<Switch defaultChecked />}
            />
            <SettingItem
              icon={<Bell className="h-5 w-5 text-[#5FBFB3]" />}
              title="Recordatorios de citas"
              rightElement={<Switch defaultChecked />}
            />
          </div>
        </div>

        {/* Location Settings - Only for pet owners */}
        {userRole === 'pet_owner' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50">
              <h2 className="font-medium">Ubicación</h2>
            </div>
            <div>
              <SettingItem
                icon={<MapPin className="h-5 w-5 text-[#5FBFB3]" />}
                title="Compartir ubicación constantemente"
                description="Permite que la app acceda a tu ubicación puntual cada vez que la abras para mejorar la precisión de los servicios cercanos."
                rightElement={
                  <Switch 
                    checked={shareLocation}
                    onCheckedChange={handleLocationSharingToggle}
                    disabled={isLoading}
                  />
                }
              />
            </div>
          </div>
        )}

        {/* Language Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50">
            <h2 className="font-medium">Idioma</h2>
          </div>
          <div>
            <SettingItem
              icon={<Globe className="h-5 w-5 text-[#5FBFB3]" />}
              title="Idioma"
              description="Español"
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50">
            <h2 className="font-medium">Seguridad</h2>
          </div>
          <div>
            <SettingItem
              icon={<Lock className="h-5 w-5 text-[#5FBFB3]" />}
              title="Cambiar contraseña"
            />
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50">
            <h2 className="font-medium">Ayuda y soporte</h2>
          </div>
          <div className="divide-y">
            <SettingItem
              icon={<HelpCircle className="h-5 w-5 text-[#5FBFB3]" />}
              title="Preguntas frecuentes"
            />
            <SettingItem
              icon={<LifeBuoy className="h-5 w-5 text-[#5FBFB3]" />}
              title="Contactar soporte"
            />
          </div>
        </div>

        {/* Account Actions */}
        <Button
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-500/10 flex items-center justify-center gap-2 py-6"
          onClick={() => navigate('/login')}
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </Button>
      </div>
    </LayoutBase>
  );
};

export default SettingsScreen;
