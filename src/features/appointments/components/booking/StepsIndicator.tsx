
import React from 'react';
import { Check } from 'lucide-react';

interface StepsIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepsIndicator: React.FC<StepsIndicatorProps> = ({ currentStep, totalSteps }) => {
  const stepLabels = ['Mascota', 'Servicio', 'Fecha y Hora', 'Confirmar'];

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          return (
            <div key={step} className="flex flex-col items-center w-1/4">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                  ${currentStep === step 
                    ? 'bg-[#79D0B8] text-white' 
                    : currentStep > step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'}`}
              >
                {currentStep > step ? <Check size={16} /> : step}
              </div>
              <span className="text-xs text-center">
                {stepLabels[index]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-1 bg-gray-200 relative">
        <div 
          className="absolute h-full bg-[#79D0B8] transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StepsIndicator;
