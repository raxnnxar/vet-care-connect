
import React from 'react';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';

const VetProfileHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [displayName, setDisplayName] = React.useState<string>('');
  
  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      // Fetch profile image from veterinarians table
      const { data: vetData, error: vetError } = await supabase
        .from('veterinarians')
        .select('profile_image_url')
        .eq('id', user.id)
        .single();
      
      if (vetError) {
        console.error('Error fetching vet profile image:', vetError);
      } else if (vetData?.profile_image_url) {
        setProfileImage(vetData.profile_image_url);
      }
      
      // Fetch display name from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile display name:', profileError);
      } else if (profileData?.display_name) {
        setDisplayName(profileData.display_name);
      }
    };
    
    fetchProfileData();
  }, [user?.id]);

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-[#79D0B8] text-white">
      <h1 className="font-medium text-lg">Mi Perfil</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{displayName}</span>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Perfil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default VetProfileHeader;
