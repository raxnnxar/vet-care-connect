
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
      
      {/* Header with back button - positioned with more space */}
      <div className="flex items-center z-10 pt-8 px-6">
        <button 
          onClick={handleBackClick}
          className="p-3 rounded-full bg-white/30 backdrop-blur-sm transition-all hover:bg-white/40"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Main content with improved vertical distribution */}
      <div className="flex flex-col flex-1 justify-center z-10 px-6 mt-4">
        {/* Header text with improved spacing and styling */}
        <div className="text-center mb-14 z-10 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h1 className="text-white text-2xl font-bold mb-2 text-shadow-sm tracking-wide">Elige tu rol</h1>
        </div>
        
        {/* Role selection with enhanced visual appeal */}
        <div className="flex flex-col gap-10 items-center w-full max-w-md mx-auto z-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
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
            className="w-full space-y-10"
          >
            {/* Pet Owner Option with enhanced styling */}
            <label 
              id="role-PET_OWNER"
              className={`relative flex flex-col p-6 rounded-xl transition-all transform duration-300 ${
                selectedRole === USER_ROLES.PET_OWNER 
                  ? 'bg-white shadow-lg border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
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
                      className={`h-5 w-5 ${selectedRole === USER_ROLES.PET_OWNER ? 'border-accent1 text-accent1' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </label>

            {/* Service Provider Option with enhanced styling */}
            <label 
              id="role-VETERINARIAN"
              className={`relative flex flex-col p-6 rounded-xl transition-all transform duration-300 ${
                selectedRole === USER_ROLES.VETERINARIAN 
                  ? 'bg-white shadow-lg border-2 border-accent1' 
                  : 'bg-[#F1F5F9] border border-white/60 hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
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
                      className={`h-5 w-5 ${selectedRole === USER_ROLES.VETERINARIAN ? 'border-accent1 text-accent1' : ''}`}
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
          disabled={!selectedRole}
          className="w-full py-7 rounded-full transition-all group"
          style={{ 
            backgroundColor: selectedRole ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            color: selectedRole ? '#1F2937' : 'rgba(0, 0, 0, 0.6)',
            opacity: selectedRole ? 1 : 0.85,
            boxShadow: selectedRole ? "0 10px 25px -5px rgba(0,0,0,0.12)" : "none",
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
