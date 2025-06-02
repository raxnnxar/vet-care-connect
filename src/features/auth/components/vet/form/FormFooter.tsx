
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Save } from 'lucide-react';

interface FormFooterProps {
  isSubmitting: boolean;
  isValid: boolean;
  hasErrors: boolean;
  onForceSubmit?: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ 
  isSubmitting, 
  isValid, 
  hasErrors,
  onForceSubmit 
}) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    if (hasErrors && onForceSubmit) {
      e.preventDefault();
      onForceSubmit();
    }
  };

  return (
    <div className="flex justify-center mt-8 mb-6">
      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="bg-[#79D0B8] hover:bg-[#5FBFB3] px-8 py-3"
        size="lg"
        onClick={handleButtonClick}
      >
        {isSubmitting ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Guardando...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Guardar y Continuar
          </>
        )}
      </Button>
    </div>
  );
};

export default FormFooter;
