
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface ServiceSize {
  tipo: 'pequeño' | 'mediano' | 'grande';
  precio: number;
}

interface ServiceSizeSelectionStepProps {
  selectedService: any;
  selectedSize: ServiceSize | null;
  onSizeSelect: (size: ServiceSize) => void;
  onGoBack: () => void;
}

const ServiceSizeSelectionStep: React.FC<ServiceSizeSelectionStepProps> = ({
  selectedService,
  selectedSize,
  onSizeSelect,
  onGoBack
}) => {
  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const capitalizeFirst = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  if (!selectedService?.tamaños || !Array.isArray(selectedService.tamaños)) {
    return null;
  }

  return (
    <>
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onGoBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="font-medium text-gray-700">Selecciona el tamaño</h3>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900">{selectedService.nombre || selectedService.name}</h4>
        <p className="text-sm text-gray-600">Elige el tamaño que mejor se adapte a tu mascota</p>
      </div>

      <div className="space-y-3">
        {selectedService.tamaños.map((tamaño: ServiceSize, index: number) => (
          <div 
            key={index}
            onClick={() => onSizeSelect(tamaño)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedSize?.tipo === tamaño.tipo 
                ? 'border-[#79D0B8] bg-[#e8f7f3]' 
                : 'border-gray-200 hover:border-[#79D0B8]'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">
                  {capitalizeFirst(tamaño.tipo)}
                </h4>
                <p className="text-sm text-gray-600">
                  Para mascotas de tamaño {tamaño.tipo}
                </p>
              </div>
              <div className="text-green-600 font-medium">
                {formatPrice(tamaño.precio)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ServiceSizeSelectionStep;
