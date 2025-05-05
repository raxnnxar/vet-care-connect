
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/molecules/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Card } from '@/ui/molecules/card';
import { Toggle } from '@/ui/atoms/toggle';
import NavbarInferior from '@/frontend/navigation/components/NavbarInferior';

// Temporary mock data for primary vet
const primaryVet = {
  id: 'primary-vet',
  name: 'Dra. Elena Martínez',
  specialization: 'Medicina General, Cirugía',
  imageUrl: 'https://randomuser.me/api/portraits/women/10.jpg',
};

// Temporary mock data for suggested vets
const suggestedVets = [
  {
    id: 'vet1',
    name: 'Dr. Carlos Rodríguez',
    specialization: 'Cardiología',
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: 'vet2',
    name: 'Dra. Laura Gómez',
    specialization: 'Dermatología',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.7,
    reviewCount: 98
  },
  {
    id: 'vet3',
    name: 'Dr. Miguel Hernández',
    specialization: 'Oftalmología',
    imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 4.9,
    reviewCount: 156
  },
  {
    id: 'vet4',
    name: 'Dra. Ana Sánchez',
    specialization: 'Nutrición',
    imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    rating: 4.6,
    reviewCount: 87
  }
];

const SaludScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('veterinarios');
  
  const handleBackClick = () => {
    navigate('/owner');
  };

  const handleScheduleClick = (vetId: string) => {
    console.log(`Schedule appointment with vet ${vetId}`);
    // Will navigate to appointment booking page in the future
  };

  const handleVetClick = (vetId: string) => {
    console.log(`Navigate to vet details ${vetId}`);
    navigate(`/owner/vets/${vetId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F9FAFB] to-[#F0F7F7]">
      {/* Header with back button */}
      <header className="bg-[#79D0B8] px-4 py-4 flex items-center shadow-md">
        <button 
          onClick={handleBackClick}
          className="mr-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-semibold text-white">Salud</h1>
      </header>

      <main className="flex-1 px-4 pb-20 pt-4 overflow-auto">
        {/* Primary Veterinarian Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3 text-[#1F2937] flex items-center">
            <span className="inline-block w-2 h-6 bg-[#FF8A65] mr-2 rounded-sm"></span>
            Veterinario de cabecera
          </h2>
          <Card className="p-4 bg-white rounded-xl flex items-center border-none shadow-lg">
            <div className="relative">
              <Avatar className="h-16 w-16 mr-4 border-2 border-[#79D0B8]">
                <AvatarImage src={primaryVet.imageUrl} alt={primaryVet.name} />
                <AvatarFallback className="bg-[#4DA6A8] text-white">
                  {primaryVet.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#79D0B8] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">★</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1F2937] text-lg">{primaryVet.name}</h3>
              {primaryVet.specialization && (
                <p className="text-sm text-gray-500">{primaryVet.specialization}</p>
              )}
              <Button 
                onClick={() => handleScheduleClick(primaryVet.id)}
                className="mt-2 bg-[#79D0B8] hover:bg-[#4DA6A8] text-white px-6 py-1 h-9 rounded-full shadow-sm transition-all duration-300 hover:shadow-md"
              >
                Agendar
              </Button>
            </div>
          </Card>
        </div>

        {/* Tabs for Veterinarios and Hospitales */}
        <Tabs 
          defaultValue="veterinarios" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-4"
        >
          <TabsList className="w-full bg-white p-1 rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <TabsTrigger 
              value="veterinarios" 
              className="flex-1 data-[state=active]:bg-[#79D0B8] data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Veterinarios
            </TabsTrigger>
            <TabsTrigger 
              value="hospitales" 
              className="flex-1 data-[state=active]:bg-[#79D0B8] data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Hospitales
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="veterinarios" className="mt-5">
            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-3 rounded-xl border border-gray-100 bg-white shadow-sm focus-visible:ring-[#79D0B8]"
              />
              <Toggle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1.5 rounded-full hover:bg-gray-100">
                <Filter className="text-gray-500 w-full h-full" />
              </Toggle>
            </div>

            {/* Suggested Veterinarians */}
            <div>
              <h2 className="font-medium text-lg mb-3 text-[#1F2937] flex items-center">
                <span className="inline-block w-2 h-6 bg-[#FF8A65] mr-2 rounded-sm"></span>
                Veterinarios sugeridos
              </h2>
              <div className="space-y-4">
                {suggestedVets.map((vet) => (
                  <Card 
                    key={vet.id}
                    className="p-4 bg-white rounded-xl flex items-center cursor-pointer hover:shadow-lg transition-all duration-300 border-none shadow-md transform hover:scale-[1.01]"
                    onClick={() => handleVetClick(vet.id)}
                  >
                    <Avatar className="h-16 w-16 mr-4 border-2 border-[#F0F0F0]">
                      <AvatarImage src={vet.imageUrl} alt={vet.name} />
                      <AvatarFallback className="bg-[#4DA6A8] text-white">
                        {vet.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1F2937] text-lg">{vet.name}</h3>
                      {vet.specialization && (
                        <p className="text-sm text-gray-500">{vet.specialization}</p>
                      )}
                      <div className="flex items-center mt-2">
                        <span className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-yellow-500" />
                        </span>
                        <span className="ml-1 text-sm font-semibold">{vet.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({vet.reviewCount} reseñas)</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hospitales">
            <div className="flex flex-col justify-center items-center py-12 px-4 bg-white rounded-xl shadow-sm mt-4">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl text-gray-400">🏥</span>
              </div>
              <p className="text-gray-500 text-center">Funcionalidad de hospitales próximamente</p>
              <p className="text-xs text-gray-400 text-center mt-2">Estamos trabajando para traerte los mejores hospitales veterinarios</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0">
        <NavbarInferior activeTab="home" />
      </footer>
    </div>
  );
};

export default SaludScreen;
