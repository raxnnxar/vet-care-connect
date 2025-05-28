
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card } from '@/ui/molecules/card';

export const EmptyChatsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-[60vh]">
      <Card className="p-8 text-center max-w-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sin conversaciones
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Todavía no tienes conversaciones activas. Empieza una desde una cita o desde el perfil de un veterinario/usuario.
        </p>
      </Card>
    </div>
  );
};
