
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ContactInformationProps {
  userDetails: {
    phone: string;
    address: string;
    profilePicture: string;
  };
  user: {
    id?: string;
    email?: string;
  } | null;
  editedPhone: string;
  editedAddress: string;
  setEditedPhone: (phone: string) => void;
  setEditedAddress: (address: string) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  setUserDetails: (details: {
    phone: string;
    address: string;
    profilePicture: string;
  }) => void;
}

const ContactInformation: React.FC<ContactInformationProps> = ({
  userDetails,
  user,
  editedPhone,
  editedAddress,
  setEditedPhone,
  setEditedAddress,
  isEditing,
  setIsEditing,
  setUserDetails,
}) => {
  const handleSaveChanges = async () => {
    if (user?.id) {
      const { error } = await supabase
        .from('pet_owners')
        .update({
          phone_number: editedPhone,
          address: editedAddress
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Error al guardar cambios');
      } else {
        setUserDetails(prev => ({
          ...prev,
          phone: editedPhone,
          address: editedAddress
        }));
        setIsEditing(false);
        toast.success('Cambios guardados exitosamente');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Información de contacto</h3>
        {!isEditing && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={20} />
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="font-medium">Correo electrónico:</span>
          <span>{user?.email || "No disponible"}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-medium">Teléfono:</span>
          {isEditing ? (
            <input 
              type="tel" 
              value={editedPhone}
              onChange={(e) => setEditedPhone(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <span>{userDetails.phone || "No disponible"}</span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-medium">Dirección:</span>
          {isEditing ? (
            <input 
              type="text" 
              value={editedAddress}
              onChange={(e) => setEditedAddress(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <span>{userDetails.address || "No disponible"}</span>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end mt-2">
            <Button 
              variant="default" 
              onClick={handleSaveChanges}
            >
              Guardar cambios
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformation;
