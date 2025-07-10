
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
import { Badge } from '@/ui/atoms/badge';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface User {
  id: string;
  display_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AdminUsersSectionProps {
  users: User[];
  loading: boolean;
}

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'admin':
      return 'destructive';
    case 'service_provider':
      return 'secondary';
    case 'pet_owner':
      return 'default';
    default:
      return 'outline';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin':
      return 'Administrador';
    case 'service_provider':
      return 'Proveedor';
    case 'pet_owner':
      return 'Dueño de Mascota';
    default:
      return role;
  }
};

export const AdminUsersSection: React.FC<AdminUsersSectionProps> = ({
  users,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.display_name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

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
          Gestión de Usuarios
        </h3>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 mobile-touch-target"
          />
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Mobile responsive table container */}
      <div className="mobile-table-wrapper">
        <div className="border rounded-lg mobile-scroll-container" style={{ height: '400px' }}>
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="min-w-[120px]">Nombre</TableHead>
                <TableHead className="min-w-[150px]">Email</TableHead>
                <TableHead className="min-w-[100px]">Rol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium break-words">
                    {user.display_name}
                  </TableCell>
                  <TableCell className="break-all text-sm">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="whitespace-nowrap">
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    No se encontraron usuarios
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
