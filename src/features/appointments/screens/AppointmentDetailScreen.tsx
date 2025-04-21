
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft } from 'lucide-react';

const AppointmentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
          <h1 className="text-white font-medium text-lg ml-2">Detalles de Cita</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="appointments" />}
    >
      <div className="p-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Cita #{id}</h2>
          <p className="text-gray-500 mb-4">Información completa de la cita estará disponible pronto.</p>
          
          <Button 
            className="w-full mt-4 bg-[#79D0B8] hover:bg-[#5FBFB3]"
            onClick={goBack}
          >
            Regresar
          </Button>
        </Card>
      </div>
    </LayoutBase>
  );
};

export default AppointmentDetailScreen;
