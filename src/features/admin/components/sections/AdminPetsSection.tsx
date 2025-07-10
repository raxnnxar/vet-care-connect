
import React, { useState, useMemo } from 'react';
import { Card } from '@/ui/molecules/card';
import { Input } from '@/ui/atoms/input';
import { SearchIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/templates/table';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface Pet {
  id: string;
  name: string;
  species: string;
  owner_email: string;
  owner_name: string;
}

interface AdminPetsSectionProps {
  pets: Pet[];
  loading: boolean;
}

export const AdminPetsSection: React.FC<AdminPetsSectionProps> = ({
  pets,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPets = useMemo(() => {
    if (!searchTerm) return pets;
    
    const term = searchTerm.toLowerCase();
    return pets.filter(pet => 
      pet.name.toLowerCase().includes(term) ||
      pet.owner_email.toLowerCase().includes(term) ||
      pet.owner_name.toLowerCase().includes(term)
    );
  }, [pets, searchTerm]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  return (
    <Card className="mobile-padding">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Gestión de Mascotas
        </h3>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por nombre de mascota o email del dueño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 mobile-touch-target"
          />
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          {filteredPets.length} mascota{filteredPets.length !== 1 ? 's' : ''} encontrada{filteredPets.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Mobile responsive table container */}
      <div className="mobile-table-wrapper">
        <div className="border rounded-lg mobile-scroll-container" style={{ height: '400px' }}>
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="min-w-[100px]">Nombre</TableHead>
                <TableHead className="min-w-[100px]">Especie</TableHead>
                <TableHead className="min-w-[150px]">Email del Dueño</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium break-words">
                    {pet.name}
                  </TableCell>
                  <TableCell className="capitalize">
                    {pet.species}
                  </TableCell>
                  <TableCell className="break-all text-sm">
                    {pet.owner_email}
                  </TableCell>
                </TableRow>
              ))}
              {filteredPets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No se encontraron mascotas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};
