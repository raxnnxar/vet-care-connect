
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/molecules/tabs';
import GroomingTab from './GroomingTab';
import { GroomingBusiness } from '../hooks/useGroomingData';

interface GroomingTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  groomingBusinesses: GroomingBusiness[];
  onGroomingClick: (groomingId: string) => void;
}

const GroomingTabs: React.FC<GroomingTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  groomingBusinesses, 
  onGroomingClick 
}) => {
  return (
    <Tabs 
      defaultValue="esteticas" 
      value={activeTab}
      onValueChange={onTabChange}
    >
      <TabsList className="w-full bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <TabsTrigger 
          value="esteticas" 
          className="flex-1 text-base py-2 data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] data-[state=active]:shadow-sm rounded-lg font-medium"
        >
          Estéticas
        </TabsTrigger>
        <TabsTrigger 
          value="servicios" 
          className="flex-1 text-base py-2 data-[state=active]:bg-[#79D0B8]/10 data-[state=active]:text-[#4DA6A8] data-[state=active]:shadow-sm rounded-lg font-medium"
        >
          Servicios
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="esteticas" className="mt-4 animate-fade-in">
        <GroomingTab groomingBusinesses={groomingBusinesses} onGroomingClick={onGroomingClick} />
      </TabsContent>
      
      <TabsContent value="servicios" className="mt-4 py-10 animate-fade-in">
        <div className="text-center py-8 text-gray-500">
          <p>Funcionalidad de servicios estará disponible próximamente.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default GroomingTabs;
