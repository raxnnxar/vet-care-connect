
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/molecules/tabs';
import VeterinariansTab from './VeterinariansTab';
import HospitalesTab from './HospitalesTab';

interface Vet {
  id: string;
  name: string;
  specialization?: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
}

interface VetTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  vets: Vet[];
  onVetClick: (vetId: string) => void;
}

const VetTabs: React.FC<VetTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  vets, 
  onVetClick 
}) => {
  return (
    <Tabs 
      defaultValue="veterinarios" 
      value={activeTab}
      onValueChange={onTabChange}
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
        <VeterinariansTab vets={vets} onVetClick={onVetClick} />
      </TabsContent>
      
      <TabsContent value="hospitales" className="mt-4 py-10 animate-fade-in">
        <HospitalesTab />
      </TabsContent>
    </Tabs>
  );
};

export default VetTabs;
