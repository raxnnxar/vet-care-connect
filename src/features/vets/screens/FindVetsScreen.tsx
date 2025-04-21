
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { Search } from 'lucide-react';
import { Input } from '@/ui/atoms/input';

const FindVetsScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const handleVetSelected = (vetId: string) => {
    navigate(`/owner/vets/${vetId}`);
  };

  return (
    <LayoutBase
      header={
        <div className="px-4 py-3 bg-[#79D0B8]">
          <h1 className="text-white font-medium text-lg mb-2">Encontrar Veterinarios</h1>
          <div className="relative">
            <Input 
              type="search"
              placeholder="Buscar veterinarios..." 
              className="pl-10 bg-white/90 border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="search" />}
    >
      <div className="p-4 pb-20">
        <h2 className="text-lg font-medium mb-3">Veterinarios Cercanos</h2>
        
        {/* Sample vet cards */}
        {[1, 2, 3].map((id) => (
          <Card key={id} className="mb-4 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleVetSelected(`vet-${id}`)}>
            <div className="flex p-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-500">Foto</span>
              </div>
              <div>
                <h3 className="font-medium">Dr. Ejemplo #{id}</h3>
                <p className="text-sm text-gray-500">Veterinario General</p>
                <div className="flex items-center mt-1">
                  <div className="text-xs px-2 py-0.5 bg-[#79D0B8]/20 text-[#79D0B8] rounded-full">
                    Disponible hoy
                  </div>
                  <span className="text-xs text-gray-500 ml-2">A 2km</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div className="text-center mt-4">
          <Button variant="outline">
            Cargar más
          </Button>
        </div>
      </div>
    </LayoutBase>
  );
};

export default FindVetsScreen;
