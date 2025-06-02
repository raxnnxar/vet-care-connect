
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Upload a profile image to the profile_pictures bucket in Supabase storage
 * 
 * @param userId User ID 
 * @param file File to upload
 * @returns URL of the uploaded image or null if upload failed
 */
export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('profile_pictures')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      });
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('profile_pictures')
      .getPublicUrl(fileName);
      
    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading profile image:', error);
    toast.error(`Error al subir la imagen: ${error.message}`);
    return null;
  }
};

/**
 * Upload a document to the vet-documents bucket in Supabase storage
 * 
 * @param userId User ID of the veterinarian
 * @param file File to upload
 * @param folder Folder name within the bucket (e.g., 'licenses', 'certifications')
 * @returns URL of the uploaded document or null if upload failed
 */
export const uploadVetDocument = async (
  userId: string,
  file: File,
  folder: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('vet-documents')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });
      
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('vet-documents')
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error: any) {
    console.error(`Error uploading ${folder} document:`, error);
    toast.error(`Error al subir el documento: ${error.message}`);
    return null;
  }
};

/**
 * Creates a unique filename for uploads
 * 
 * @param userId User ID
 * @param originalFilename Original filename
 * @returns Unique filename
 */
export const createUniqueFilename = (userId: string, originalFilename: string): string => {
  const fileExt = originalFilename.split('.').pop();
  return `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
};
