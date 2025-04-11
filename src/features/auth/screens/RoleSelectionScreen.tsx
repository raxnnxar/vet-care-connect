
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { VettLogo } from '@/ui/atoms/VettLogo';
import { ArrowLeft, Users, Stethoscope } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/ui/atoms/radio-group';
import { useNavigate } from 'react-router-dom';
import { UserRoleType, USER_ROLES } from '@/core/constants/app.constants';

interface RoleSelectionScreenProps {
  onRoleSelected?: (role: UserRoleType) => void;
  onBack?: () => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ 
  onRoleSelected, 
  onBack 
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRoleType | null>(null);
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  const handleContinue = () => {
    if (selectedRole && onRoleSelected) {
      onRoleSelected(selectedRole);
    } else if (selectedRole) {
      // Default navigation if no callback provided
      navigate('/signup');
    }
  };

  return (
    <div className="relative flex flex-col h-screen px-6 py-8 overflow-hidden">
      {/* Background with enhanced gradient */}
      <div 
        className="absolute inset-0 w-full h-full z-0" 
        style={{ 
          background: `radial-gradient(circle at 50% 10%, #9EE5CA, ${brandColor} 70%)`,
        }}
      />
      
      {/* Back button positioned at the top */}
      <div className="flex items-center mb-6 z-10">
        <button 
          onClick={handleBackClick}
          className="flex items-center justify-center p-2 rounded-full bg-white/30 backdrop-blur-sm transition-all hover:bg-white/40"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Logo (smaller version) */}
      <div className="flex items-center justify-center mb-10 z-10">
        <VettLogo color="white" size="md" />
      </div>
      
      {/* Header section */}
      <div className="text-center mb-8 z-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h1 className="text-white text-2xl font-bold mb-2 text-shadow-sm">Elige tu rol</h1>
        <p className="text-white/90 font-medium">Selecciona cómo quieres usar Vett</p>
      </div>
      
      {/* Role selection */}
      <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <RadioGroup 
          value={selectedRole || ''} 
          onValueChange={(value) => setSelectedRole(value as UserRoleType)}
          className="w-full space-y-4"
        >
          {/* Pet Owner Option */}
          <label 
            className={`relative flex flex-col p-4 rounded-xl transition-all ${
              selectedRole === USER_ROLES.PET_OWNER 
                ? 'bg-white shadow-md border-2 border-accent1' 
                : 'bg-white/90 border border-white/60'
            }`}
          >
            <div className="flex items-start mb-2">
              <div className={`p-2 rounded-lg mr-3 ${
                selectedRole === USER_ROLES.PET_OWNER 
                  ? 'bg-accent1/10 text-accent1' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Dueño de mascota</span>
                  <RadioGroupItem 
                    value={USER_ROLES.PET_OWNER} 
                    id="pet-owner"
                    className={selectedRole === USER_ROLES.PET_OWNER ? 'border-accent1 text-accent1' : ''}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Programa citas veterinarias y gestiona la salud de tus mascotas
                </p>
              </div>
            </div>
          </label>

          {/* Veterinarian Option */}
          <label 
            className={`relative flex flex-col p-4 rounded-xl transition-all ${
              selectedRole === USER_ROLES.VETERINARIAN 
                ? 'bg-white shadow-md border-2 border-accent1' 
                : 'bg-white/90 border border-white/60'
            }`}
          >
            <div className="flex items-start mb-2">
              <div className={`p-2 rounded-lg mr-3 ${
                selectedRole === USER_ROLES.VETERINARIAN 
                  ? 'bg-accent1/10 text-accent1' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Veterinario</span>
                  <RadioGroupItem 
                    value={USER_ROLES.VETERINARIAN} 
                    id="veterinarian"
                    className={selectedRole === USER_ROLES.VETERINARIAN ? 'border-accent1 text-accent1' : ''}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Administra tus citas y pacientes
                </p>
              </div>
            </div>
          </label>
        </RadioGroup>
      </div>
      
      {/* Continue button */}
      <div className="flex flex-col items-center mt-auto mb-8 z-10 w-full max-w-xs mx-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
        <Button 
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full py-6 rounded-full transition-all group"
          style={{ 
            backgroundColor: selectedRole ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            color: selectedRole ? '#1F2937' : 'rgba(31, 41, 55, 0.7)',
            opacity: selectedRole ? 1 : 0.85,
            boxShadow: selectedRole ? "0 8px 20px -5px rgba(0,0,0,0.15)" : "none",
          }}
        >
          <span className={`text-xl font-semibold ${!selectedRole ? 'opacity-70' : ''}`}>
            Continuar
          </span>
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
