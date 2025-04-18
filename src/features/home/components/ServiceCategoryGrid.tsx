
import React from 'react';
import { Heart, Scissors, Store, Dog, Map, Building } from 'lucide-react';

type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
};

const serviceCategories: ServiceCategory[] = [
  {
    id: 'health',
    name: 'Salud',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 'spa',
    name: 'Estética y spa',
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    id: 'store',
    name: 'Tienda',
    icon: <Store className="w-6 h-6" />,
    isComingSoon: true,
  },
  {
    id: 'training',
    name: 'Entrenamiento',
    icon: <Dog className="w-6 h-6" />,
    isComingSoon: true,
  },
  {
    id: 'walks',
    name: 'Paseos',
    icon: <Map className="w-6 h-6" />,
    isComingSoon: true,
  },
  {
    id: 'boarding',
    name: 'Hospedaje',
    icon: <Building className="w-6 h-6" />,
    isComingSoon: true,
  },
];

const ServiceCategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {serviceCategories.map((category) => (
        <button
          key={category.id}
          className={`relative flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-100
                     transition-all duration-200 ${category.isComingSoon ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}`}
          disabled={category.isComingSoon}
        >
          <div className="text-[#5FBFB3] mb-2">{category.icon}</div>
          <span className="text-sm font-medium text-gray-700">{category.name}</span>
          {category.isComingSoon && (
            <span className="absolute top-2 right-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              Próximamente
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ServiceCategoryGrid;
