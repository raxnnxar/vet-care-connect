
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Save } from 'lucide-react';

interface FormFooterProps {
  isSubmitting: boolean;
  isValid: boolean;
  hasErrors: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({ isSubmitting, isValid, hasErrors }) => {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          {hasErrors && (
            <p className="text-red-500 text-sm">
              Hay campos con errores. Por favor revisa todas las secciones.
            </p>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting || !isValid} 
          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar Perfil
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormFooter;
