
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Calendar } from 'lucide-react';

const BookAppointmentScreen: React.FC = () => {
  const { vetId } = useParams<{ vetId: string }>();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Agendar Cita</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Reservar con Veterinario</h2>
          <p className="text-gray-500 mb-4">ID del veterinario: {vetId}</p>
          <p className="mb-6">El formulario para agendar citas estará disponible próximamente.</p>
          
          <div className="flex gap-4 mt-4">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={goBack}
            >
              Cancelar
            </Button>
            
            <Button 
              className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Continuar
            </Button>
          </div>
        </Card>
      </div>
    </LayoutBase>
  );
};

export default BookAppointmentScreen;
