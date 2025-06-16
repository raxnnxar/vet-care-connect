
import React from 'react';

export const getStatusBadge = (status: string) => {
  const statusMap: { [key: string]: { label: string; color: string } } = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    programada: { label: 'Confirmada', color: 'bg-green-100 text-green-800' },
    completada: { label: 'Completada', color: 'bg-blue-100 text-blue-800' },
    cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800' }
  };
  
  const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
};
