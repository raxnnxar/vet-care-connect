
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/molecules/tabs";
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
  onTabChange: (tabName: string) => void;
  vets: Vet[];
  onVetClick: (vetId: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const VetTabs = ({ 
  activeTab, 
  onTabChange, 
  vets, 
  onVetClick,
  searchQuery,
  onSearch,
  isLoading = false
}: VetTabsProps) => {
  return (
    <div className="mt-2">
      <Tabs defaultValue="veterinarios" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="flex w-full bg-white rounded-full p-1 border border-gray-200">
          <TabsTrigger
            value="veterinarios"
            className="flex-1 py-2 rounded-full data-[state=active]:bg-[#79D0B8] data-[state=active]:text-white"
          >
            Veterinarios
          </TabsTrigger>
          <TabsTrigger
            value="hospitales"
            className="flex-1 py-2 rounded-full data-[state=active]:bg-[#79D0B8] data-[state=active]:text-white"
          >
            Hospitales
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="veterinarios" className="mt-4">
          <VeterinariansTab 
            vets={vets} 
            onVetClick={onVetClick} 
            searchQuery={searchQuery}
            onSearchChange={e => onSearch(e.target.value)}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="hospitales" className="mt-4">
          <HospitalesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VetTabs;
