
import React from 'react';
import { Link } from 'react-router-dom';
import VettLogo from '../../../ui/atoms/VettLogo';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-primary text-white p-6">
      {/* Logo section */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex items-center mb-6">
          <VettLogo className="w-48 h-auto" />
        </div>

        <p className="text-center text-lg mb-4" style={{fontFamily: 'Work Sans, sans-serif'}}>
          Todo para tu mascota en un solo lugar
        </p>
      </div>
      
      {/* Action buttons */}
      <div className="w-full max-w-xs mb-10">
        <Link to="/role-selection" className="block w-full mb-6">
          <button 
            className="w-full py-3 px-6 text-lg bg-white text-primary hover:bg-gray-100 rounded-lg font-medium transition-colors shadow-md"
          >
            Empezar <span className="ml-2">→</span>
          </button>
        </Link>

        <div className="text-center">
          <Link 
            to="/login" 
            className="text-white hover:underline"
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            Si ya tienes una cuenta, inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
