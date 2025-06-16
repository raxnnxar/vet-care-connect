
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Clock, Check, X, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Appointment } from '../api/vetAppointmentsApi';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface PendingRequestsListProps {
  requests: Appointment[];
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests }) => {
  const navigate = useNavigate();

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepting request:', requestId);
    // TODO: Implement accept logic
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // TODO: Implement reject logic
  };

  const handleViewDetails = (requestId: string) => {
    navigate(`/vet/appointments/${requestId}`);
  };

  const handleRefreshRequests = () => {
    console.log('Refreshing requests');
    // TODO: Implement refresh logic
  };

  const formatRequestDate = (dateData: any) => {
    try {
      if (typeof dateData === 'string') {
        const date = parseISO(dateData);
        return format(date, "d 'de' MMMM", { locale: es });
      } else if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.date) {
          const date = parseISO(dateData.date);
          return format(date, "d 'de' MMMM", { locale: es });
        }
      }
      return 'Fecha no disponible';
    } catch (err) {
      return 'Fecha no disponible';
    }
  };

  const formatRequestTime = (dateData: any) => {
    try {
      if (typeof dateData === 'string') {
        const date = parseISO(dateData);
        return format(date, "h:mm a", { locale: es });
      } else if (typeof dateData === 'object' && dateData !== null) {
        if (dateData.time) {
          return dateData.time;
        }
      }
      return 'Hora no disponible';
    } catch (err) {
      return 'Hora no disponible';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-[#1F2937]">
          Solicitudes pendientes
        </h2>
        <Button
          onClick={handleRefreshRequests}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Actualizar</span>
        </Button>
      </div>
      
      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map((request) => (
            <Card 
              key={request.id} 
              className="p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewDetails(request.id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F2937]">{request.petName}</p>
                    <p className="text-sm text-gray-600">Solicitud de cita</p>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Pendiente
                </span>
              </div>
              
              <div className="mb-3 space-y-1">
                <p className="text-sm text-gray-600">
                  <strong>Fecha:</strong> {formatRequestDate(request.appointment_date)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Hora:</strong> {formatRequestTime(request.appointment_date)}
                </p>
                {request.service_type && typeof request.service_type === 'object' && (
                  <p className="text-sm text-gray-600">
                    <strong>Servicio:</strong> {(request.service_type as any).name || 'Servicio no especificado'}
                  </p>
                )}
                {request.reason && (
                  <p className="text-sm text-gray-600">
                    <strong>Motivo:</strong> {request.reason}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  onClick={() => handleAcceptRequest(request.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Check size={16} className="mr-1" />
                  Aceptar
                </Button>
                <Button
                  onClick={() => handleRejectRequest(request.id)}
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  size="sm"
                >
                  <X size={16} className="mr-1" />
                  Rechazar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center border border-gray-200">
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-gray-100 p-3 rounded-full">
              <Clock size={24} className="text-gray-400" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">
                No hay solicitudes pendientes
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Las nuevas solicitudes de citas aparecerán aquí
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PendingRequestsList;
