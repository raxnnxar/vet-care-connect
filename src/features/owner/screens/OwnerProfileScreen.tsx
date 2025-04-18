
import React, { useState } from 'react';
import { User } from '@/core/types/user';
import { useSelector } from 'react-redux';
import { Edit2 } from 'lucide-react';
import { LayoutBase } from '@/frontend/navigation/components';
import { NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import ProfileImageUploader from '@/features/auth/components/ProfileImageUploader';
import PetList from '@/features/auth/components/PetList';
import { toast } from 'sonner';
import { usePets } from '@/features/pets/hooks';

const OwnerProfileScreen = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { pets, isLoading: petsLoading } = usePets();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>(user || {});
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // In a real app, we would update the user profile here
      toast.success('Perfil actualizado con éxito');
      setIsEditing(false);
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setProfileImage(user?.profileImage || null);
    setProfileImageFile(null);
    setIsEditing(false);
  };

  return (
    <LayoutBase
      header={
        <div className="flex justify-between items-center px-4 py-3 bg-[#5FBFB3] text-white">
          <h1 className="text-lg font-semibold">Mi Perfil</h1>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={handleEdit}
            >
              <Edit2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="flex flex-col gap-6 p-4 pb-20">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          {isEditing ? (
            <ProfileImageUploader
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              setProfileImageFile={setProfileImageFile}
              isUploading={isUploading}
              displayName={user?.displayName}
            />
          ) : (
            <Avatar className="h-24 w-24 border-4 border-primary/30">
              <AvatarImage src={user?.profileImage} />
              <AvatarFallback className="bg-primary/20 text-primary text-xl">
                {user?.displayName?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* User Information Section */}
        <div className="space-y-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nombre</Label>
            <Input
              id="displayName"
              value={isEditing ? editedUser.displayName : user?.displayName}
              onChange={(e) => setEditedUser({ ...editedUser, displayName: e.target.value })}
              readOnly={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              value={isEditing ? editedUser.phone : user?.phone}
              onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
              readOnly={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email}
              readOnly
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Edit Buttons */}
        {isEditing && (
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
            >
              Guardar
            </Button>
          </div>
        )}

        {/* Pets Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Mis Mascotas</h2>
          </div>
          <PetList pets={pets} isLoading={petsLoading} />
        </div>
      </div>
    </LayoutBase>
  );
};

export default OwnerProfileScreen;
