import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-primary text-white p-6">
      {/* Logo section */}
      <div className="flex flex-col items-center mt-20">
        <div className="flex items-center mb-6">
          <svg width="48" height="48" viewBox="0 0 40 40" fill="white" xmlns="http://www.w3.org/2000/svg" className="mr-3">
            <path d="M30.5,11c-1.5-1.6-3.9-2-5.7-1c-1.1-2.3-3.4-3.9-6.1-3.9c-3.8,0-6.8,3.1-6.8,6.8c0,0.3,0,0.5,0.1,0.8
            C9.7,14.4,8,16.5,8,19c0,3,2.4,5.5,5.5,5.5c0.1,0,0.1,0,0.2,0c0.7,1.3,2,2.2,3.6,2.2c1.2,0,2.3-0.6,3-1.5
            c0.8,0.9,1.9,1.5,3.2,1.5c1.5,0,2.8-0.8,3.6-1.9c0.2,0,0.4,0,0.6,0c3.1,0,5.5-2.5,5.5-5.5C33,16.1,32,13.8,30.5,11z" />
          </svg>
          <h1 className="text-5xl font-bold" style={{fontFamily: 'Rubik, sans-serif'}}>Vett</h1>
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