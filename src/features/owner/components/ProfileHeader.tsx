import React from 'react';
import { Avatar } from '@/ui/atoms/avatar';
import { User, Pencil } from 'lucide-react';
import { profileImageService } from '@/features/auth/api/profileImageService';
import { toast } from 'sonner';
interface ProfileHeaderProps {
  userDetails: {
    phone: string;
    address: string;
    profilePicture: string;
  };
  user: {
    id?: string;
    displayName?: string;
  } | null;
  setUserDetails: (details: {
    phone: string;
    address: string;
    profilePicture: string;
  }) => void;
}
const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userDetails,
  user,
  setUserDetails
}) => {
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user?.id) {
      const uploadedUrl = await profileImageService.uploadProfileImage(user.id, file);
      if (uploadedUrl) {
        setUserDetails({
          ...userDetails,
          profilePicture: uploadedUrl
        });
        toast.success('Imagen de perfil actualizada');
      }
    }
  };
  return <div className="flex flex-col items-center mb-6 bg-white rounded-lg p-6 shadow-sm relative">
      <div className="relative mb-3">
        <Avatar className="h-24 w-24">
          {userDetails.profilePicture ? <img src={userDetails.profilePicture} alt={user?.displayName} className="w-full h-full object-cover rounded-full" /> : <div className="flex items-center justify-center w-full h-full text-white text-2xl bg-[#79d0b8]">
              {user?.displayName?.charAt(0) || <User size={36} />}
            </div>}
        </Avatar>
        <label htmlFor="profile-image-upload" className="absolute bottom-0 right-0 bg-white text-[#5FBFB3] rounded-full p-2 cursor-pointer shadow-md">
          <Pencil size={16} />
          <input type="file" id="profile-image-upload" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
        </label>
      </div>
      <h2 className="text-xl font-semibold">{user?.displayName || "Usuario"}</h2>
      <p className="text-gray-500">Dueño de mascota</p>
    </div>;
};
export default ProfileHeader;