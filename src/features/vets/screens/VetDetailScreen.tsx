
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Calendar, Phone, Mail, MapPin, Clock, Star } from 'lucide-react';

const VetDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`/owner/appointments/book/${id}`);
  };

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
          <h1 className="text-white font-medium text-lg ml-2">Perfil de Veterinario</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="search" />}
    >
      <div className="p-4 pb-20">
        {/* Vet profile header */}
        <Card className="mb-4 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-500">Foto</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Dr. Ejemplo</h2>
                <p className="text-gray-600">Veterinario General</p>
                <div className="flex items-center mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 text-gray-300" />
                  <span className="text-sm text-gray-500 ml-1">4.0 (24 reseñas)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-[#79D0B8] mr-2" />
                <span className="text-sm">A 2km - Calle Ejemplo #123, Ciudad</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-[#79D0B8] mr-2" />
                <span className="text-sm">+52 555 123 4567</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#79D0B8] mr-2" />
                <span className="text-sm">ejemplo@veterinario.com</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-[#79D0B8] mr-2" />
                <span className="text-sm">Lunes a Viernes: 9AM - 6PM</span>
              </div>
            </div>
          </div>
        </Card>

        {/* About section */}
        <Card className="mb-4">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Sobre mí</h3>
            <p className="text-gray-600">
              Veterinario con más de 10 años de experiencia especializado en animales pequeños. 
              Ofrezco servicios de medicina preventiva, diagnóstico y tratamiento para mascotas.
            </p>
          </div>
        </Card>

        {/* Services section */}
        <Card className="mb-4">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">Servicios</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#79D0B8] rounded-full mr-2"></div>
                <span>Consultas generales</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#79D0B8] rounded-full mr-2"></div>
                <span>Vacunación</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#79D0B8] rounded-full mr-2"></div>
                <span>Desparasitación</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-[#79D0B8] rounded-full mr-2"></div>
                <span>Cirugía menor</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Book button */}
        <Button 
          className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3]"
          onClick={handleBookAppointment}
        >
          <Calendar className="mr-2 h-5 w-5" />
          Agendar Cita
        </Button>
      </div>
    </LayoutBase>
  );
};

export default VetDetailScreen;
