
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
      color: 'bg-gradient-to-r from-blue-400 to-blue-500',
      description: 'Veterinarios y urgencias',
      route: '/owner/salud'
    },
    {
      id: 'grooming',
      title: 'Estética',
      icon: Scissors,
      color: 'bg-gradient-to-r from-purple-400 to-purple-500',
      description: 'Servicios de belleza y cuidado',
      route: '/owner/estetica'
    },
    {
      id: 'treatments',
      title: 'Tratamientos',
      icon: Pill,
      color: 'bg-gradient-to-r from-green-400 to-green-500',
      description: 'Gestiona medicación y cuidados',
      route: '/owner/treatments'
    },
    {
      id: 'nearby',
      title: 'Cerca de ti',
      icon: MapPin,
      color: 'bg-gradient-to-r from-orange-400 to-orange-500',
      description: 'Servicios cercanos a tu ubicación',
      route: '/owner/find-vets'
    }
  ];

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Servicios</h2>
      <div className="space-y-3">
        {serviceCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="w-full bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 text-left group hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center shadow-sm`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategoryGrid;
