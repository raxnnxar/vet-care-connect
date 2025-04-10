import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-primary text-white p-6">
      {/* Logo section */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex items-center mb-6">
          <svg width="60" height="60" viewBox="0 0 200 200" fill="white" xmlns="http://www.w3.org/2000/svg" className="mr-4">
            <path d="M140.8 40.5c-8.2-2.3-16.8 1.1-21.3 8.4-4.5-7.3-13.1-10.7-21.3-8.4-11.5 3.2-18.1 15.2-14.9 26.7 2.6 9.3 17.1 25.9 36.2 41.3 19.1-15.4 33.6-32 36.2-41.3 3.2-11.5-3.4-23.5-14.9-26.7z" />
            <path d="M100 60c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40zm0 70c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z" />
            <circle cx="85" cy="85" r="5" fill="#7ECEC4" />
          </svg>
          <h1 className="text-5xl font-bold">Vett</h1>
        </div>
        
        <p className="text-center text-lg mb-4">
          Todo para tu mascota en un solo lugar
        </p>
      </div>
      
      {/* Action buttons - already working correctly */}
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
