
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Pill, Scissors, MapPin, ChevronRight } from 'lucide-react';

const ServiceCategoryGrid = () => {
  const navigate = useNavigate();

  const serviceCategories = [
    {
      id: 'health',
      title: 'Salud',
      icon: Stethoscope,
      backgroundColor: 'bg-orange-50/50',
      iconColor: 'bg-gradient-to-br from-orange-400 to-orange-500',
      description: 'Veterinarios y urgencias',
      route: '/owner/salud'
    },
    {
      id: 'grooming',
      title: 'Estética',
      icon: Scissors,
      backgroundColor: 'bg-purple-50/50',
      iconColor: 'bg-gradient-to-br from-purple-400 to-purple-500',
      description: 'Servicios de belleza y cuidado',
      route: '/owner/estetica'
    },
    {
      id: 'treatments',
      title: 'Tratamientos',
      icon: Pill,
      backgroundColor: 'bg-blue-50/50',
      iconColor: 'bg-gradient-to-br from-teal-500 to-teal-600',
      description: 'Gestiona medicación y cuidados',
      route: '/owner/treatments'
    },
    {
      id: 'nearby',
      title: 'Cerca de ti',
      icon: MapPin,
      backgroundColor: 'bg-amber-50/50',
      iconColor: 'bg-gradient-to-br from-amber-400 to-orange-400',
      description: 'Servicios cercanos a tu ubicación',
      route: '/owner/find-vets'
    }
  ];

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="space-y-6">
      {/* Saludo personalizado */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Hola! 🐾
        </h2>
        <p className="text-gray-600 text-lg">
          ¿Qué necesita tu mascota hoy?
        </p>
      </div>

      {/* Tarjetas de servicios */}
      <div className="space-y-4">
        {serviceCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className={`w-full ${category.backgroundColor} rounded-2xl p-6 border border-white/60 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99] backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className={`${category.iconColor} w-14 h-14 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                    <IconComponent className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-xl mb-1.5">{category.title}</h3>
                    <p className="text-gray-600 text-base leading-relaxed">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/60 group-hover:bg-white/80 transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" strokeWidth={2} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategoryGrid;
