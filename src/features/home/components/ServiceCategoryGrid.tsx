
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Pill, Scissors, MapPin } from 'lucide-react';

const ServiceCategoryGrid = () => {
  const navigate = useNavigate();

  const serviceCategories = [
    {
      id: 'health',
      title: 'Salud',
      icon: Stethoscope,
      color: 'bg-blue-500',
      description: 'Encuentra veterinarios',
      route: '/owner/salud'
    },
    {
      id: 'grooming',
      title: 'Estética',
      icon: Scissors,
      color: 'bg-purple-500',
      description: 'Servicios de belleza',
      route: '/owner/estetica'
    },
    {
      id: 'treatments',
      title: 'Tratamientos',
      icon: Pill,
      color: 'bg-green-500',
      description: 'Gestiona tratamientos',
      route: '/owner/treatments'
    },
    {
      id: 'nearby',
      title: 'Cerca de ti',
      icon: MapPin,
      color: 'bg-orange-500',
      description: 'Servicios cercanos',
      route: '/owner/find-vets'
    }
  ];

  const handleCategoryClick = (route: string) => {
    navigate(route);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Servicios</h2>
      <div className="grid grid-cols-2 gap-4">
        {serviceCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-800 mb-1">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategoryGrid;
