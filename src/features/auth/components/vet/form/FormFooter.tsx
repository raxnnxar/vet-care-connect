
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
    <div className="sticky bottom-6 z-10 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-4 flex justify-between items-center">
        <div>
          {hasErrors && (
            <p className="text-red-500 text-sm">
              Hay campos con errores, pero puedes guardar de todos modos.
            </p>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
          size="lg"
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
