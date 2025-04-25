
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Service for handling profile-related operations with Supabase
 */
export const profileService = {
  /**
   * Upload profile image to Supabase storage
   * @param userId - The ID of the user
   * @param imageFile - The image file to upload
   * @returns The URL of the uploaded image or null if the upload failed
   */
  async uploadProfileImage(userId: string, imageFile: File): Promise<string | null> {
    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${userId}/profile-image.${fileExt}`;
      
      // Use the standardized "profile_pictures" bucket
      const { data, error } = await supabase.storage
        .from('profile_pictures')
        .upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type,
        });
      
      if (error) {
        console.error('Error uploading profile image:', error);
        toast.error('Error al subir la imagen de perfil');
        return null;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);
      
      return publicUrlData.publicUrl || null;
    } catch (error) {
      console.error('Error in uploadProfileImage:', error);
      return null;
    }
  },
  
  /**
   * Update pet owner profile information in Supabase
   * @param userId - The ID of the user
   * @param profile - The profile data to update
   * @returns True if the update was successful, false otherwise
   */
  async updatePetOwnerProfile(
    userId: string, 
    profile: { phoneNumber?: string; profilePictureUrl?: string }
  ): Promise<boolean> {
    try {
      const { phoneNumber, profilePictureUrl } = profile;
      const updateData: Record<string, any> = {};
      
      if (phoneNumber !== undefined) {
        updateData.phone_number = phoneNumber;
      }
      
      if (profilePictureUrl !== undefined) {
        updateData.profile_picture_url = profilePictureUrl;
      }
      
      const { error } = await supabase
        .from('pet_owners')
        .update(updateData)
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating pet owner profile:', error);
        toast.error('Error al actualizar el perfil');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updatePetOwnerProfile:', error);
      return false;
    }
  }
};
