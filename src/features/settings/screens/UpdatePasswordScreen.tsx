
import React, { useState } from 'react';
import { LayoutBase } from '@/frontend/navigation/components';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UpdatePasswordScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleGoBack = () => {
    navigate('/owner/settings');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.currentPassword.trim()) {
      toast({
        title: "Error",
        description: "Ingresa tu contraseña actual",
        variant: "destructive"
      });
      return false;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar la contraseña. Verifica tu contraseña actual.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Éxito",
          description: "Contraseña actualizada correctamente",
          variant: "default"
        });
        
        // Limpiar el formulario
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Opcional: regresar a configuración después de unos segundos
        setTimeout(() => {
          navigate('/owner/settings');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center justify-between p-4 bg-[#79D0B8]">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-white p-1 mr-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-medium text-white">Actualizar contraseña</h1>
          </div>
        </div>
      }
    >
      <div className="p-4 pb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-[#79D0B8]/10 mr-4">
              <Lock className="h-6 w-6 text-[#79D0B8]" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">Cambiar contraseña</h2>
              <p className="text-sm text-gray-600">Actualiza tu contraseña para mayor seguridad</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contraseña actual */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="font-medium text-base">
                Contraseña actual *
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-medium text-base">
                Nueva contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  placeholder="Ingresa tu nueva contraseña (mín. 6 caracteres)"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium text-base">
                Confirmar nueva contraseña *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón de guardar */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#79D0B8] hover:bg-[#6BC4A6] text-white font-medium py-3 mt-8"
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </form>

          {/* Link de recuperación de contraseña */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              ¿Olvidaste tu contraseña?{' '}
              <button
                onClick={handleForgotPassword}
                className="text-[#79D0B8] hover:text-[#6BC4A6] font-medium underline"
              >
                Recuperar contraseña
              </button>
            </p>
          </div>
        </div>
      </div>
    </LayoutBase>
  );
};

export default UpdatePasswordScreen;
