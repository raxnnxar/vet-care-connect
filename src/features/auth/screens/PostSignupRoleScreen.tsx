import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/atoms/button';
import { Users, Briefcase } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/ui/atoms/radio-group';
import { useNavigate } from 'react-router-dom';
import { UserRoleType, USER_ROLES } from '@/core/constants/app.constants';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { AppDispatch } from '@/state/store';
import { assignUserRole } from '../store/authThunks';

const PostSignupRoleScreen: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRoleType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state.auth);
  
  // Define the colors
  const brandColor = "#79d0b8"; // Teal color for the brand
  const accentColor = "#FF8A65"; // Coral accent for warmth
  
  useEffect(() => {
    // Check if user exists and has necessary data
    if (!user || !user.id) {
      console.error("Missing user data in PostSignupRoleScreen:", user);
      // Keep the user on this page, but show a warning
      toast.warning('Información de usuario incompleta. Por favor, inicia sesión nuevamente si el problema persiste.');
    }
  }, [user]);
  
  // Handle role selection and database update with improved error handling
  const handleContinue = async () => {
    if (!selectedRole) {
      toast.error('Por favor, selecciona un rol para continuar');
      return;
    }
    
    if (!user || !user.id) {
      console.error('Missing user data:', { user });
      toast.error('Información de usuario no disponible. Por favor, inicia sesión de nuevo.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const roleToAssign = selectedRole === USER_ROLES.PET_OWNER ? 'pet_owner' : 'service_provider';
      
      console.log('Starting assignUserRole with:', { 
        userId: user.id, 
        role: roleToAssign,
        selectedRole,
        userRolesEnum: USER_ROLES
      });
      
      // Update the user's role in the database using the new function
      const resultAction = await dispatch(assignUserRole({
        userId: user.id,
        role: roleToAssign
      }));
      
      console.log('Result action type:', resultAction.type);
      console.log('Full result action:', JSON.stringify(resultAction, null, 2));
      
      if (assignUserRole.fulfilled.match(resultAction)) {
        console.log('Role selection successful:', resultAction.payload);
        toast.success('Rol seleccionado con éxito');
        
        // If service provider, proceed to service type selection
        if (selectedRole === USER_ROLES.VETERINARIAN) {
          navigate('/post-signup-service-type');
        } else {
          // If pet owner, navigate to the owner dashboard
          navigate('/owner');
        }
      } else {
        console.error('Role selection failed:', resultAction.error);
        console.error('Error details:', resultAction.payload);
        toast.error('Hubo un problema al seleccionar el rol. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error in role selection:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
      toast.error('Error al actualizar el rol. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden">
      {/* Enhanced gradient background with more depth */}
      <div 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ 
          background: `radial-gradient(circle at 50% 0%, rgba(158, 229, 202, 0.8), ${brandColor} 70%)`,
        }}
      />
      
      {/* Add a subtle pattern overlay for depth */}
      <div 
        className="absolute inset-0 w-full h-full z-0 bg-vett-pattern opacity-10"
        aria-hidden="true"
      />
      
      {/* Main content - adjusted position */}
      <div className="flex flex-col flex-1 z-10 px-6">
        {/* Header text with improved styling and prominence */}
        <div className="text-center mt-10 mb-6 z-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-white text-3xl font-bold mb-2 text-shadow-sm tracking-wide">
            Elige tu rol
          </h1>
          <div className="w-16 h-1 bg-white/70 mx-auto rounded-full mt-1"></div>
          <p className="text-white text-lg mt-4">
            ¡Bienvenido a Vett! Selecciona tu rol para continuar.
          </p>
        </div>
        
        {/* Role selection with enhanced visual appeal */}
        <div className="flex flex-col gap-6 items-center w-full max-w-md mx-auto mt-8 z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <RadioGroup 
            value={selectedRole || ''} 
            onValueChange={(value) => {
              console.log('Selected role value:', value);
              setSelectedRole(value as UserRoleType);
              // Add animation effect when selecting a role
              const targetEl = document.getElementById(`role-${value}`);
              if (targetEl) {
                targetEl.classList.add('scale-105');
                setTimeout(() => {
                  targetEl.classList.remove('scale-105');
                }, 300);
              }
            }}
            className="w-full space-y-8"
          >
            {/* Pet Owner Option with improved text alignment and spacing */}
            <label 
              id="role-pet_owner"
              className={`relative flex flex-col p-7 rounded-xl transition-all transform duration-300 ${
                selectedRole === USER_ROLES.PET_OWNER 
                  ? 'bg-white shadow-lg border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-5 ${
                  selectedRole === USER_ROLES.PET_OWNER 
                    ? 'bg-accent1/15 text-accent1' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-lg">Dueño de mascota</span>
                    <RadioGroupItem 
                      value={USER_ROLES.PET_OWNER} 
                      id="pet-owner"
                      className={`h-5 w-5 ml-4 ${selectedRole === USER_ROLES.PET_OWNER ? 'border-accent1 text-accent1' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </label>

            {/* Service Provider Option with improved text alignment and spacing */}
            <label 
              id="role-veterinarian"
              className={`relative flex flex-col p-7 rounded-xl transition-all transform duration-300 ${
                selectedRole === USER_ROLES.VETERINARIAN 
                  ? 'bg-white shadow-lg border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-5 ${
                  selectedRole === USER_ROLES.VETERINARIAN 
                    ? 'bg-accent1/15 text-accent1' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-lg">Proveedor de servicios</span>
                    <RadioGroupItem 
                      value={USER_ROLES.VETERINARIAN} 
                      id="veterinarian"
                      className={`h-5 w-5 ml-4 ${selectedRole === USER_ROLES.VETERINARIAN ? 'border-accent1 text-accent1' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>
      </div>
      
      {/* Continue button with enhanced styling and positioning */}
      <div className="flex flex-col items-center mt-auto mb-14 z-10 w-full max-w-xs mx-auto px-6 animate-fade-up" style={{ animationDelay: '300ms' }}>
        <Button 
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="w-full py-7 rounded-full transition-all group"
          style={{ 
            backgroundColor: selectedRole ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            color: selectedRole ? '#1F2937' : 'rgba(0, 0, 0, 0.6)',
            opacity: selectedRole ? 1 : 0.85,
            boxShadow: selectedRole ? "0 10px 25px -5px rgba(0,0,0,0.12)" : "none",
            fontWeight: selectedRole ? 600 : 500,
          }}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            <span className={`text-xl ${!selectedRole ? 'opacity-70' : ''}`}>
              Continuar
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PostSignupRoleScreen;
