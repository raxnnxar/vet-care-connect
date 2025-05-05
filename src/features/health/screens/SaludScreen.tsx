
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/molecules/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Card } from '@/ui/molecules/card';
import { Toggle } from '@/ui/atoms/toggle';

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
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* Header with back button */}
      <header className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button 
          onClick={handleBackClick}
          className="mr-3 p-1.5 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1F2937]">Salud</h1>
      </header>

      <main className="flex-1 px-4 pb-20 pt-4 overflow-auto">
        {/* Primary Veterinarian Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3 text-[#1F2937]">Veterinario de cabecera</h2>
          <Card className="p-3 bg-white flex items-center">
            <Avatar className="h-16 w-16 mr-3 border-2 border-[#79D0B8]">
              <AvatarImage src={primaryVet.imageUrl} alt={primaryVet.name} />
              <AvatarFallback>
                {primaryVet.name.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1F2937]">{primaryVet.name}</h3>
              {primaryVet.specialization && (
                <p className="text-sm text-gray-500">{primaryVet.specialization}</p>
              )}
              <Button 
                onClick={() => handleScheduleClick(primaryVet.id)}
                className="mt-2 bg-[#79D0B8] hover:bg-[#4DA6A8] text-white px-4 py-1 h-8"
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
          <TabsList className="w-full bg-gray-100 p-1">
            <TabsTrigger 
              value="veterinarios" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#79D0B8] data-[state=active]:shadow"
            >
              Veterinarios
            </TabsTrigger>
            <TabsTrigger 
              value="hospitales" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-[#79D0B8] data-[state=active]:shadow"
            >
              Hospitales
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="veterinarios" className="mt-3">
            {/* Search bar */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar por nombre o especialidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 rounded-lg border border-gray-200"
              />
              <Toggle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-1.5">
                <Filter className="text-gray-500 w-full h-full" />
              </Toggle>
            </div>

            {/* Suggested Veterinarians */}
            <div>
              <h2 className="font-medium text-lg mb-3 text-[#1F2937]">Veterinarios sugeridos</h2>
              <div className="space-y-3">
                {suggestedVets.map((vet) => (
                  <Card 
                    key={vet.id}
                    className="p-3 bg-white flex items-center cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleVetClick(vet.id)}
                  >
                    <Avatar className="h-14 w-14 mr-3">
                      <AvatarImage src={vet.imageUrl} alt={vet.name} />
                      <AvatarFallback>
                        {vet.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1F2937]">{vet.name}</h3>
                      {vet.specialization && (
                        <p className="text-sm text-gray-500">{vet.specialization}</p>
                      )}
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 text-sm font-medium">{vet.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">({vet.reviewCount} reseñas)</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="hospitales">
            <div className="flex justify-center items-center py-10 text-gray-500">
              <p>Funcionalidad de hospitales próximamente</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SaludScreen;
