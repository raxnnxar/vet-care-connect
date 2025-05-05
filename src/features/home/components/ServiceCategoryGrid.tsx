
import React from 'react';
import { Heart, Scissors, Store, Dog, Map, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/frontend/shared/constants/routes';

type ServiceCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
  route?: string;
  accentColor: string;
};

const ServiceCategoryGrid = () => {
  const navigate = useNavigate();
  
  const serviceCategories: ServiceCategory[] = [
    {
      id: 'health',
      name: 'Salud',
      icon: <Heart className="w-6 h-6" />,
      route: ROUTES.OWNER_SALUD,
      accentColor: '#79D0B8',
    },
    {
      id: 'spa',
      name: 'Estética y spa',
      icon: <Scissors className="w-6 h-6" />,
      isComingSoon: true,
      accentColor: '#FF8A65',
    },
    {
      id: 'store',
      name: 'Tienda',
      icon: <Store className="w-6 h-6" />,
      isComingSoon: true,
      accentColor: '#4DA6A8',
    },
    {
      id: 'training',
      name: 'Entrenamiento',
      icon: <Dog className="w-6 h-6" />,
      isComingSoon: true,
      accentColor: '#FF8A65',
    },
    {
      id: 'walks',
      name: 'Paseos',
      icon: <Map className="w-6 h-6" />,
      isComingSoon: true,
      accentColor: '#4DA6A8',
    },
    {
      id: 'boarding',
      name: 'Hospedaje',
      icon: <Building className="w-6 h-6" />,
      isComingSoon: true,
      accentColor: '#79D0B8',
    },
  ];

  const handleCategoryClick = (category: ServiceCategory) => {
    if (!category.isComingSoon && category.route) {
      navigate(category.route);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {serviceCategories.map((category) => (
        <button
          key={category.id}
          className={`relative flex flex-col items-center justify-center p-5 bg-white rounded-xl shadow-sm border border-gray-100
                     transition-all duration-300 ${category.isComingSoon ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md active:scale-95 hover:border-[#79D0B8]'}`}
          disabled={category.isComingSoon}
          onClick={() => handleCategoryClick(category)}
          style={{ 
            boxShadow: category.id === 'health' ? '0 4px 12px rgba(121, 208, 184, 0.15)' : '' 
          }}
        >
          <div className="text-[#5FBFB3] mb-3 bg-gray-50 p-3 rounded-full" style={{ color: category.accentColor }}>
            {category.icon}
          </div>
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
