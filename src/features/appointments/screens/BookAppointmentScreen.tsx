
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';

const BookAppointmentScreen = () => {
  const { vetId } = useParams<{ vetId: string }>();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={goBack} className="text-white mr-2">
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-white text-lg font-semibold">Agendar Cita</h1>
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Veterinario ID: {vetId}</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Formulario de reserva en desarrollo</p>
        </div>
      </div>
    </LayoutBase>
  );
};

export default BookAppointmentScreen;
