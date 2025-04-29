
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Upload a document to the vet-documents bucket in Supabase storage
 * 
 * @param userId User ID of the veterinarian
 * @param file File to upload
 * @param folder Folder name within the bucket (e.g., 'profile-images', 'licenses')
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
