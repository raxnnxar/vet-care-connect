
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Clock, Check, X, RefreshCw } from 'lucide-react';

interface PendingRequest {
  id: string;
  petName: string;
  ownerName: string;
  requestedDate: string;
  requestedTime: string;
  service: string;
  notes?: string;
}

interface GroomingPendingRequestsListProps {
  requests: PendingRequest[];
}

const GroomingPendingRequestsList: React.FC<GroomingPendingRequestsListProps> = ({ requests }) => {
  const handleAcceptRequest = (requestId: string) => {
    console.log('Accepting request:', requestId);
    // TODO: Implement accept logic
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // TODO: Implement reject logic
  };

  const handleRefreshRequests = () => {
    console.log('Refreshing requests');
    // TODO: Implement refresh logic
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
            <Card key={request.id} className="p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F2937]">{request.petName}</p>
                    <p className="text-sm text-gray-600">Cliente: {request.ownerName}</p>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Pendiente
                </span>
              </div>
              
              <div className="mb-3 space-y-1">
                <p className="text-sm text-gray-600">
                  <strong>Fecha:</strong> {request.requestedDate}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Hora:</strong> {request.requestedTime}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Servicio:</strong> {request.service}
                </p>
                {request.notes && (
                  <p className="text-sm text-gray-600">
                    <strong>Notas:</strong> {request.notes}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-2">
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

export default GroomingPendingRequestsList;
