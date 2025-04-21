
import React from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Bell, Check, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { ScrollArea } from '@/ui/molecules/scroll-area';

// Notification types
type NotificationType = "appointment" | "reminder" | "alert" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Cita confirmada',
    message: 'Tu cita con Dr. García para Luna ha sido confirmada para mañana a las 15:00.',
    date: '2023-09-15T14:30:00',
    isRead: false
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Recordatorio de vacunación',
    message: 'Max necesita su vacuna contra la rabia este mes.',
    date: '2023-09-12T09:15:00',
    isRead: true
  },
  {
    id: '3',
    type: 'alert',
    title: 'Medicamento casi agotado',
    message: 'El medicamento para la alergia de Milo está por agotarse. Recuerda renovar la receta.',
    date: '2023-09-10T18:45:00',
    isRead: false
  },
  {
    id: '4',
    type: 'info',
    title: 'Consejos de cuidado',
    message: 'Nuevas recomendaciones sobre la dieta para perros adultos disponibles en nuestra app.',
    date: '2023-09-05T11:20:00',
    isRead: true
  }
];

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  switch (type) {
    case 'appointment':
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case 'reminder':
      return <Clock className="h-5 w-5 text-amber-500" />;
    case 'alert':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'info':
    default:
      return <Bell className="h-5 w-5 text-green-500" />;
  }
};

const NotificationCard: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { type, title, message, date, isRead } = notification;
  const formattedDate = new Date(date).toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`p-4 rounded-lg mb-3 border ${isRead ? 'bg-gray-50' : 'bg-white border-l-4 border-l-[#5FBFB3]'}`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="p-2 rounded-full bg-gray-100">
            <NotificationIcon type={type} />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            <p className="text-xs text-gray-500 mt-2">{formattedDate}</p>
          </div>
        </div>
        {!isRead && (
          <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500">
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const NotificationsScreen = () => {
  const unreadCount = sampleNotifications.filter(n => !n.isRead).length;

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3]">
          <h1 className="text-white font-medium text-lg">Notificaciones</h1>
          {unreadCount > 0 && (
            <div className="bg-white text-[#5FBFB3] rounded-full px-2 py-0.5 text-xs font-medium">
              {unreadCount} sin leer
            </div>
          )}
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <ScrollArea className="h-full">
        <div className="p-4 pb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recientes</h2>
            <Button variant="ghost" size="sm" className="text-sm">
              Marcar todo como leído
            </Button>
          </div>

          {sampleNotifications.length > 0 ? (
            <div>
              {sampleNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-gray-500">No hay notificaciones</h3>
            </div>
          )}
        </div>
      </ScrollArea>
    </LayoutBase>
  );
};

export default NotificationsScreen;
