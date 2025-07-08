import React, { useState } from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/templates/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { Badge } from '@/ui/atoms/badge';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface User {
  id: string;
  display_name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AdminUserManagementProps {
  users: User[];
  loading: boolean;
  onUpdateUserRole: (userId: string, newRole: string) => Promise<boolean>;
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

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  users,
  loading,
  onUpdateUserRole,
}) => {
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleEditRole = (user: User) => {
    setEditingUser(user.id);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async (userId: string) => {
    if (selectedRole && selectedRole !== users.find(u => u.id === userId)?.role) {
      const success = await onUpdateUserRole(userId, selectedRole);
      if (success) {
        setEditingUser(null);
        setSelectedRole('');
      }
    } else {
      setEditingUser(null);
      setSelectedRole('');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setSelectedRole('');
  };

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
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Gestión de Usuarios
        </h3>
        <p className="text-muted-foreground text-sm">
          Total de usuarios: {users.length}
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.display_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {editingUser === user.id ? (
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pet_owner">Dueño de Mascota</SelectItem>
                        <SelectItem value="service_provider">Proveedor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {editingUser === user.id ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleSaveRole(user.id)}
                        >
                          Guardar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRole(user)}
                      >
                        Editar Rol
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};