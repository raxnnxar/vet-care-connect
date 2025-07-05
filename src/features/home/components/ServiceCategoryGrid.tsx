
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Pill, Scissors, MapPin, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';

const ServiceCategoryGrid = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', user.id)
            .single();
          
          if (data && !error) {
            setDisplayName(data.display_name);
          }
        } catch (err) {
          console.error('Error fetching display name:', err);
        }
      }
    };

    fetchDisplayName();
  }, [user?.id]);

  const serviceCategories = [
    {
      id: 'health',
      title: 'Salud',
      icon: Stethoscope,
      description: 'Veterinarios y urgencias',
      route: '/owner/salud',
      size: 'full'
    },
    {
      id: 'grooming',
      title: 'Estética',
      icon: Scissors,
      description: 'Servicios de belleza y cuidado',
      route: '/owner/estetica',
      size: 'half'
    },
    {
      id: 'nearby',
      title: 'Cerca de ti',
      icon: MapPin,
      description: 'Servicios cercanos a tu ubicación',
      route: '/owner/find-vets',
      size: 'half'
    },
    {
      id: 'treatments',
      title: 'Tratamientos',
      icon: Pill,
      description: 'Gestiona medicación y cuidados',
      route: '/owner/treatments',
      size: 'full'
    }
  ];

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Greeting Section - Compact */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          ¡Hola{displayName ? `, ${displayName}` : ''}!
        </h2>
        <p className="text-gray-600 text-base">
          ¿Qué necesita tu mascota hoy?
        </p>
      </div>

      {/* Service Categories Grid */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Full width - Salud */}
        <button
          onClick={() => handleCategoryClick(serviceCategories[0].route)}
          className="w-full bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-20"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="bg-[#4DA6A8] w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Stethoscope className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-0.5">{serviceCategories[0].title}</h3>
                <p className="text-gray-600 text-sm">{serviceCategories[0].description}</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" strokeWidth={2} />
            </div>
          </div>
        </button>

        {/* Half width row - Estética and Cerca de ti */}
        <div className="flex gap-3">
          <button
            onClick={() => handleCategoryClick(serviceCategories[1].route)}
            className="flex-1 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-24"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-[#4DA6A8] w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-2">
                <Scissors className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-800 text-base mb-0.5">{serviceCategories[1].title}</h3>
            </div>
          </button>
          
          <button
            onClick={() => handleCategoryClick(serviceCategories[2].route)}
            className="flex-1 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-24"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-[#4DA6A8] w-10 h-10 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow mb-2">
                <MapPin className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-800 text-base mb-0.5">{serviceCategories[2].title}</h3>
            </div>
          </button>
        </div>

        {/* Full width - Tratamientos */}
        <button
          onClick={() => handleCategoryClick(serviceCategories[3].route)}
          className="w-full bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] h-20"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <div className="bg-[#4DA6A8] w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Pill className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-0.5">{serviceCategories[3].title}</h3>
                <p className="text-gray-600 text-sm">{serviceCategories[3].description}</p>
              </div>
            </div>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" strokeWidth={2} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ServiceCategoryGrid;
