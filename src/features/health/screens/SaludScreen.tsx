
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Star, MapPin } from 'lucide-react';
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
    reviewCount: 124,
    distance: '1.2 km'
  },
  {
    id: 'vet2',
    name: 'Dra. Laura Gómez',
    specialization: 'Dermatología',
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.7,
    reviewCount: 98,
    distance: '2.5 km'
  },
  {
    id: 'vet3',
    name: 'Dr. Miguel Hernández',
    specialization: 'Oftalmología',
    imageUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
    rating: 4.9,
    reviewCount: 156,
    distance: '0.8 km'
  },
  {
    id: 'vet4',
    name: 'Dra. Ana Sánchez',
    specialization: 'Nutrición',
    imageUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    rating: 4.6,
    reviewCount: 87,
    distance: '3.1 km'
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#E6F7F5]">
      {/* Header with back button */}
      <header className="bg-white px-4 py-4 flex items-center shadow-md rounded-b-xl bg-gradient-to-r from-[#79D0B8] to-[#4DA6A8] sticky top-0 z-10">
        <button 
          onClick={handleBackClick}
          className="mr-3 p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-white">Salud</h1>
      </header>

      <main className="flex-1 px-4 pb-24 pt-5 overflow-auto space-y-6">
        {/* Primary Veterinarian Section */}
        <div>
          <h2 className="text-lg font-medium mb-3 text-[#1F2937] flex items-center">
            <span className="mr-2 bg-accent3/20 p-1 rounded-md text-accent3">💼</span>
            Veterinario de cabecera
          </h2>
          <Card className="p-4 bg-white flex items-center rounded-xl shadow-md border-l-4 border-accent1">
            <div className="relative">
              <Avatar className="h-20 w-20 mr-4 border-2 border-[#79D0B8] shadow-lg">
                <AvatarImage src={primaryVet.imageUrl} alt={primaryVet.name} className="object-cover" />
                <AvatarFallback className="bg-[#79D0B8] text-white">
                  {primaryVet.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1F2937] text-lg">{primaryVet.name}</h3>
              {primaryVet.specialization && (
                <p className="text-sm text-gray-600">{primaryVet.specialization}</p>
              )}
              <Button 
                onClick={() => handleScheduleClick(primaryVet.id)}
                className="mt-3 bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-md transition-all duration-200 rounded-lg font-medium"
                size="sm"
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
          className=""
        >
          <TabsList className="w-full bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <TabsTrigger 
              value="veterinarios" 
              className="flex-1 text-base py-2 data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] data-[state=active]:shadow-sm rounded-lg font-medium"
            >
              Veterinarios
            </TabsTrigger>
            <TabsTrigger 
              value="hospitales" 
              className="flex-1 text-base py-2 data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] data-[state=active]:shadow-sm rounded-lg font-medium"
            >
              Hospitales
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="veterinarios" className="mt-4 animate-fade-in">
            {/* Search bar */}
            <div className="relative mb-5">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <Input
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-3 rounded-xl border border-gray-200 shadow-sm bg-white focus:ring-2 focus:ring-[#79D0B8]/30 focus:border-[#79D0B8]"
              />
              <Toggle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1.5 hover:bg-[#79D0B8]/10 rounded-lg">
                <Filter className="text-gray-500 w-full h-full" />
              </Toggle>
            </div>

            {/* Suggested Veterinarians */}
            <div>
              <h2 className="font-medium text-lg mb-3 text-[#1F2937] flex items-center">
                <span className="mr-2 bg-accent1/20 p-1 rounded-md text-accent1">⭐</span>
                Veterinarios sugeridos
              </h2>
              <div className="space-y-4">
                {suggestedVets.map((vet) => (
                  <Card 
                    key={vet.id}
                    className="p-4 bg-white flex items-center cursor-pointer hover:shadow-md transition-shadow rounded-xl relative overflow-hidden border-l-2 border-[#79D0B8]"
                    onClick={() => handleVetClick(vet.id)}
                  >
                    <Avatar className="h-16 w-16 mr-3 shadow-sm">
                      <AvatarImage src={vet.imageUrl} alt={vet.name} className="object-cover" />
                      <AvatarFallback className="bg-[#79D0B8] text-white">
                        {vet.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1F2937] text-base">{vet.name}</h3>
                      {vet.specialization && (
                        <p className="text-sm text-gray-500">{vet.specialization}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{vet.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({vet.reviewCount} reseñas)</span>
                        <div className="ml-auto flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {vet.distance}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hospitales" className="mt-4 py-10 animate-fade-in">
            <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-dashed border-gray-300">
              <div className="bg-gray-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-[#1F2937] mb-2">Sección en desarrollo</h3>
              <p className="text-gray-500">La funcionalidad de hospitales estará disponible próximamente</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Bottom Navigation */}
      <NavbarInferior activeTab="home" />
    </div>
  );
};

export default SaludScreen;

import { Building } from 'lucide-react';
