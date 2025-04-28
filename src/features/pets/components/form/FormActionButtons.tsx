
import React from 'react';
import { Button } from '@/ui/atoms/button';

interface FormActionButtonsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  actionLabel?: string;
  cancelLabel?: string;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({
  isSubmitting,
  onCancel,
  actionLabel = 'Guardar y continuar',
  cancelLabel = 'Cancelar'
}) => {
  return (
    <div className="sticky bottom-0 pt-4 bg-white bg-opacity-95 mt-6 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 text-base font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : actionLabel}
        </Button>
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full text-center"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormActionButtons;
