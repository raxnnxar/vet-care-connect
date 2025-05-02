
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';
import { Cat, Check, X, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingRequest {
  id: string;
  petName: string;
  time: string;
  date: string;
}

interface PendingRequestsListProps {
  requests: PendingRequest[];
}

const PendingRequestsList: React.FC<PendingRequestsListProps> = ({ requests }) => {
  const navigate = useNavigate();

  const handleViewRequest = (requestId: string) => {
    navigate(`/vet/appointments/${requestId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-medium text-[#1F2937] mb-3">Solicitudes pendientes</h2>
      {requests.map((request) => (
        <Card key={request.id} className="p-3 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-full">
                <Cat size={24} className="text-[#4DA6A8]" />
              </div>
              <div>
                <p className="font-medium text-lg">{request.petName}</p>
                <p className="text-gray-500">{request.date} — {request.time}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              className="bg-[#79D0B8] hover:bg-[#5FBFB3] text-white rounded-full h-10 w-10 p-0"
              size="icon"
              onClick={() => handleViewRequest(request.id)}
            >
              <Check size={18} />
            </Button>
            <Button 
              className="bg-[#EF4444] hover:bg-red-400 text-white rounded-full h-10 w-10 p-0"
              size="icon"
            >
              <X size={18} />
            </Button>
            <Button 
              variant="outline"
              className="border-[#79D0B8] text-[#79D0B8] hover:bg-[#79D0B8]/10 rounded-full h-10 w-10 p-0"
              size="icon"
            >
              <MessageSquare size={18} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PendingRequestsList;
