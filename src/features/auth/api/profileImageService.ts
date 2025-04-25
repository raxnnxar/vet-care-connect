
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const profileImageService = {
  async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile-${Date.now()}.${fileExt}`;
      
      // Use the standardized "profile_pictures" bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });
      
      if (uploadError) {
        console.error('Error uploading profile image:', uploadError);
        toast.error('Error al subir la imagen de perfil');
        return null;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
      
      // Update only the pet_owners table which has the profile_picture_url column
      // The profiles table does not have this column according to our TypeScript error
      const { error: petOwnerError } = await supabase
        .from('pet_owners')
        .update({ profile_picture_url: publicUrl })
        .eq('id', userId);
      
      if (petOwnerError) {
        console.error('Error updating pet owner profile picture URL:', petOwnerError);
        toast.error('Error al actualizar la imagen de perfil');
        return null;
      }
      
      return publicUrl;
    } catch (error) {
      console.error('Unexpected error in uploadProfileImage:', error);
      toast.error('Error inesperado al subir la imagen');
      return null;
    }
  }
};
