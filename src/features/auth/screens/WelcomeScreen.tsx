
import React from 'react';
import { Link } from 'react-router-dom';
import VettLogo from '../../../ui/atoms/VettLogo';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-primary text-white p-6">
      {/* Logo section */}
      <div className="flex flex-col items-center mt-20">
        <VettLogo className="w-full max-w-xs mb-10" />
      </div>
      
      {/* Action buttons */}
      <div className="w-full max-w-xs mb-10">
        <Link to="/role-selection" className="block w-full mb-6">
          <button 
            className="w-full py-3 px-6 text-lg bg-white text-primary hover:bg-gray-100 rounded-full font-semibold transition-colors shadow-md"
          >
            Empezar
          </button>
        </Link>

        <div className="text-center">
          <Link 
            to="/login" 
            className="text-white hover:underline"
          >
            Si ya tienes una cuenta, inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
