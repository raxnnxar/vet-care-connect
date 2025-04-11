
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Users, Briefcase } from 'lucide-react';
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
  
  // Define the brandColor variable that was missing
  const brandColor = "#79d0b8"; // Teal color for the brand
  const accentColor = "#FF8A65"; // Coral accent for warmth
  const accentTeal = "#4DA6A8"; // Deep teal blue for better contrast
  
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
      
      {/* Header section with back button only - removed logo as requested */}
      <div className="flex items-center z-10 mb-8">
        <button 
          onClick={handleBackClick}
          className="p-2 rounded-full bg-white/30 backdrop-blur-sm transition-all hover:bg-white/40"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Main content - moved further down with increased spacing */}
      <div className="flex flex-col flex-1 justify-center z-10">
        {/* Header text - with increased spacing below */}
        <div className="text-center mb-12 z-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-white text-2xl font-bold mb-2 text-shadow-sm">Elige tu rol</h1>
        </div>
        
        {/* Role selection - with increased spacing between cards */}
        <div className="flex flex-col gap-8 items-center w-full max-w-md mx-auto z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <RadioGroup 
            value={selectedRole || ''} 
            onValueChange={(value) => {
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
            {/* Pet Owner Option - adjusted with light gray background and increased padding */}
            <label 
              id="role-PET_OWNER"
              className={`relative flex flex-col p-5 rounded-xl transition-all transform duration-300 ${
                selectedRole === USER_ROLES.PET_OWNER 
                  ? 'bg-white shadow-md border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F1F5F9]/95'
              }`}
            >
              <div className="flex items-start">
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
                </div>
              </div>
            </label>

            {/* Service Provider Option - adjusted with light gray background and increased padding */}
            <label 
              id="role-VETERINARIAN"
              className={`relative flex flex-col p-5 rounded-xl transition-all transform duration-300 ${
                selectedRole === USER_ROLES.VETERINARIAN 
                  ? 'bg-white shadow-md border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F1F5F9]/95'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-lg mr-3 ${
                  selectedRole === USER_ROLES.VETERINARIAN 
                    ? 'bg-accent1/10 text-accent1' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Proveedor de servicios</span>
                    <RadioGroupItem 
                      value={USER_ROLES.VETERINARIAN} 
                      id="veterinarian"
                      className={selectedRole === USER_ROLES.VETERINARIAN ? 'border-accent1 text-accent1' : ''}
                    />
                  </div>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>
      </div>
      
      {/* Continue button with improved contrast */}
      <div className="flex flex-col items-center mt-auto mb-8 z-10 w-full max-w-xs mx-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
        <Button 
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full py-6 rounded-full transition-all group"
          style={{ 
            backgroundColor: selectedRole ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            color: selectedRole ? '#1F2937' : 'rgba(0, 0, 0, 0.6)',
            opacity: selectedRole ? 1 : 0.85,
            boxShadow: selectedRole ? "0 8px 20px -5px rgba(0,0,0,0.15)" : "none",
            fontWeight: selectedRole ? 600 : 500,
          }}
        >
          <span className={`text-xl ${!selectedRole ? 'opacity-70' : ''}`}>
            Continuar
          </span>
        </Button>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
