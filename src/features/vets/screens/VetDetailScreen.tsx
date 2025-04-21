
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft, Calendar, Star, MapPin, Phone, Clock, User } from 'lucide-react';
import { Avatar } from '@/ui/atoms/avatar';

const VetDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleBookAppointment = () => {
    navigate(`/owner/appointments/book/${id}`);
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={goBack} className="text-white mr-2">
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-white text-lg font-semibold">Perfil de Veterinario</h1>
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="flex flex-col p-4 pb-20">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <div className="bg-[#5FBFB3]/20 h-full w-full flex items-center justify-center">
                <User className="h-8 w-8 text-[#5FBFB3]" />
              </div>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-xl font-medium">
                {id === "123" ? "Dr. Carlos Rodríguez" : "Dra. Ana Martínez"}
              </h2>
              <p className="text-gray-500">
                {id === "123" ? "Medicina General" : "Cirugía"}
              </p>
              
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">
                  {id === "123" ? "4.2" : "4.9"} 
                  <span className="text-gray-500 ml-1">({id === "123" ? "56" : "78"} reseñas)</span>
                </span>
              </div>
              
              <div className="flex items-center mt-3 text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">A 2.5 km de distancia</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <h3 className="font-medium mb-3">Información de Contacto</h3>
          <div className="flex items-center mb-3">
            <Phone className="h-4 w-4 text-[#5FBFB3] mr-3" />
            <span>+52 123 456 7890</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-[#5FBFB3] mr-3" />
            <div>
              <p className="text-sm">Lun - Vie: 9:00 AM - 6:00 PM</p>
              <p className="text-sm">Sáb: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <h3 className="font-medium mb-3">Acerca de</h3>
          <p className="text-gray-700 text-sm">
            {id === "123" 
              ? "Especialista en medicina general para pequeñas mascotas con más de 10 años de experiencia. Graduado de la Universidad Nacional Autónoma de México."
              : "Cirujana veterinaria especializada en procedimientos ortopédicos y de tejidos blandos. Amplia experiencia en cirugías de emergencia."}
          </p>
        </div>
        
        <Button onClick={handleBookAppointment} className="mt-4 bg-[#5FBFB3] hover:bg-[#4DA6A8]">
          <Calendar className="mr-2 h-4 w-4" />
          Agendar Cita
        </Button>
      </div>
    </LayoutBase>
  );
};

export default VetDetailScreen;
