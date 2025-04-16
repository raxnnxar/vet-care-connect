
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface FinishSetupButtonProps {
  isSubmitting: boolean;
}

const FinishSetupButton: React.FC<FinishSetupButtonProps> = ({ isSubmitting }) => {
  return (
    <div className="flex justify-center mt-8">
      <Button 
        type="submit"
        className="bg-accent3 hover:bg-accent3/90 text-white py-4 px-6 text-base font-medium flex items-center justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            Finalizar y continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </div>
  );
};

export default FinishSetupButton;
