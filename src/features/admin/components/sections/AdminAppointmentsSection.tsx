
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

interface Appointment {
  id: string;
  appointment_date: string;
  pet_name: string;
  owner_email: string;
  vet_email: string;
  status: string;
}

interface AdminAppointmentsSectionProps {
  appointments: Appointment[];
  loading: boolean;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmada':
    case 'programada':
      return 'default';
    case 'pendiente':
      return 'secondary';
    case 'completada':
      return 'default';
    case 'cancelada':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'Pendiente';
    case 'confirmed':
    case 'programada':
      return 'Confirmada';
    case 'completed':
      return 'Completada';
    case 'cancelled':
    case 'cancelada':
      return 'Cancelada';
    default:
      return status || 'Sin estado';
  }
};

export const AdminAppointmentsSection: React.FC<AdminAppointmentsSectionProps> = ({
  appointments,
  loading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = useMemo(() => {
    if (!searchTerm) return appointments;
    
    const term = searchTerm.toLowerCase();
    return appointments.filter(appointment => 
      appointment.pet_name?.toLowerCase().includes(term) ||
      appointment.owner_email?.toLowerCase().includes(term) ||
      appointment.vet_email?.toLowerCase().includes(term)
    );
  }, [appointments, searchTerm]);

  const formatDate = (dateString: string) => {
    try {
      // Handle if dateString is a JSON object
      let date;
      if (typeof dateString === 'string' && dateString.startsWith('{')) {
        const parsed = JSON.parse(dateString);
        date = new Date(parsed.date || parsed.datetime || dateString);
      } else {
        date = new Date(dateString);
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
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
    <Card className="mobile-padding">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Gestión de Citas
        </h3>
        
        {/* Search bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por mascota, dueño o veterinario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 mobile-touch-target"
          />
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">
          {filteredAppointments.length} cita{filteredAppointments.length !== 1 ? 's' : ''} encontrada{filteredAppointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Mobile responsive table container */}
      <div className="mobile-table-wrapper">
        <div className="border rounded-lg mobile-scroll-container" style={{ height: '400px' }}>
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="min-w-[100px]">Fecha</TableHead>
                <TableHead className="min-w-[100px]">Mascota</TableHead>
                <TableHead className="min-w-[120px]">Dueño</TableHead>
                <TableHead className="min-w-[120px]">Veterinario</TableHead>
                <TableHead className="min-w-[100px]">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="text-sm">
                    {formatDate(appointment.appointment_date)}
                  </TableCell>
                  <TableCell className="font-medium break-words">
                    {appointment.pet_name || 'Sin nombre'}
                  </TableCell>
                  <TableCell className="break-all text-sm">
                    {appointment.owner_email || 'Sin email'}
                  </TableCell>
                  <TableCell className="break-all text-sm">
                    {appointment.vet_email || 'Sin asignar'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(appointment.status)} className="whitespace-nowrap text-xs">
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No se encontraron citas
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
