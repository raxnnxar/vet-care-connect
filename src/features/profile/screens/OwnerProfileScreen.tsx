
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Avatar } from '@/ui/atoms/avatar';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { User, Settings, Pencil, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutThunk } from '@/features/auth/store/authThunks';
import { AppDispatch } from '@/state/store';
import { toast } from 'sonner';
import { ROUTES } from '@/frontend/shared/constants/routes';

const OwnerProfileScreenComponent = () => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
      toast.success('Sesión cerrada con éxito');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white text-xl font-semibold">Perfil</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="h-full flex flex-col">
        {/* Profile header */}
        <div className="bg-[#5FBFB3]/10 p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-[#5FBFB3]">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" />
              ) : (
                <div className="bg-[#5FBFB3] h-full w-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
              )}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user?.displayName || 'Usuario'}</h2>
              <p className="text-gray-600">{user?.email}</p>
              {user?.phone && <p className="text-gray-600">{user.phone}</p>}
            </div>
          </div>
        </div>

        {/* Profile options */}
        <div className="flex-1 p-4 space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start py-6 text-left border-gray-200"
            onClick={() => navigate(ROUTES.OWNER_PETS)}
          >
            <div className="flex items-center">
              <div className="bg-[#5FBFB3]/10 p-2 rounded-full mr-4">
                <img src="/lovable-uploads/053f0f17-f20a-466e-b7fe-5f6b4edbd41b.png" alt="Pet icon" className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Mis mascotas</p>
                <p className="text-sm text-gray-500">Gestiona la información de tus mascotas</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start py-6 text-left border-gray-200"
            onClick={() => navigate(ROUTES.PROFILE_SETUP)}
          >
            <div className="flex items-center">
              <div className="bg-[#5FBFB3]/10 p-2 rounded-full mr-4">
                <Pencil className="h-6 w-6 text-[#5FBFB3]" />
              </div>
              <div>
                <p className="font-medium">Editar perfil</p>
                <p className="text-sm text-gray-500">Actualiza tu información personal</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start py-6 text-left border-gray-200"
            onClick={() => navigate(ROUTES.OWNER_SETTINGS)}
          >
            <div className="flex items-center">
              <div className="bg-[#5FBFB3]/10 p-2 rounded-full mr-4">
                <Settings className="h-6 w-6 text-[#5FBFB3]" />
              </div>
              <div>
                <p className="font-medium">Configuración</p>
                <p className="text-sm text-gray-500">Preferencias y notificaciones</p>
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start py-6 text-left border-gray-200 mt-auto"
            onClick={handleLogout}
          >
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-4">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-red-500">Cerrar sesión</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default OwnerProfileScreenComponent;
