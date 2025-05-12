
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarInferior from '@/frontend/navigation/components/NavbarInferior';
import SaludHeader from '../components/SaludHeader';
import PrimaryVet from '../components/PrimaryVet';
import VetTabs from '../components/VetTabs';

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
      <SaludHeader onBackClick={handleBackClick} />

      <main className="flex-1 px-4 pb-24 pt-5 overflow-auto space-y-6">
        <PrimaryVet vet={primaryVet} onScheduleClick={handleScheduleClick} />
        <VetTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          vets={suggestedVets}
          onVetClick={handleVetClick}
        />
      </main>
      
      <NavbarInferior activeTab="home" />
    </div>
  );
};

export default SaludScreen;
