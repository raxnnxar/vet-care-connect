
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VaccineDocument {
  id: string;
  pet_id: string;
  document_url: string;
  uploaded_at: string;
  uploaded_by: string;
  notes?: string;
}

export interface CreateVaccineDocumentData {
  pet_id: string;
  document_url: string;
  uploaded_by: string;
  notes?: string;
}

/**
 * API service for vaccine documents operations
 */
export const vaccineDocumentsApi = {
  /**
   * Upload a vaccine document file to storage and save record to database
   */
  async uploadVaccineDocument(petId: string, file: File, notes?: string): Promise<{ data: VaccineDocument | null; error: any }> {
    try {
      console.log('Uploading vaccine document for pet:', petId);
      
      if (!petId) {
        throw new Error('Pet ID is required');
      }
      
      if (!file) {
        throw new Error('File is required');
      }
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User must be authenticated');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${petId}/${Date.now()}_vaccine.${fileExt}`;
      
      console.log('Uploading to vaccine-documents bucket with path:', fileName);
      
      // Upload the file to the vaccine-documents bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vaccine-documents')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) {
        console.error('Error uploading vaccine document:', uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', uploadData);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('vaccine-documents')
        .getPublicUrl(fileName);
      
      const documentUrl = publicUrlData.publicUrl;
      console.log('Document URL:', documentUrl);
      
      // Insert record into vaccine_documents table
      const { data: documentData, error: insertError } = await supabase
        .from('vaccine_documents')
        .insert({
          pet_id: petId,
          document_url: documentUrl,
          uploaded_by: user.id,
          notes: notes || null
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error saving vaccine document record:', insertError);
        throw insertError;
      }
      
      console.log('Vaccine document saved successfully:', documentData);
      return { data: documentData, error: null };
    } catch (error) {
      console.error('Error in uploadVaccineDocument:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Get all vaccine documents for a pet
   */
  async getVaccineDocuments(petId: string): Promise<{ data: VaccineDocument[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('vaccine_documents')
        .select('*')
        .eq('pet_id', petId)
        .order('uploaded_at', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching vaccine documents:', error);
      return { data: null, error };
    }
  },
  
  /**
   * Delete a vaccine document
   */
  async deleteVaccineDocument(documentId: string): Promise<{ error: any }> {
    try {
      // First get the document to extract the file path
      const { data: document, error: fetchError } = await supabase
        .from('vaccine_documents')
        .select('document_url')
        .eq('id', documentId)
        .single();
      
      if (fetchError || !document) {
        throw fetchError || new Error('Document not found');
      }
      
      // Extract file path from URL
      const url = new URL(document.document_url);
      const filePath = url.pathname.split('/').slice(-3).join('/'); // Get user_id/pet_id/filename
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('vaccine-documents')
        .remove([filePath]);
      
      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('vaccine_documents')
        .delete()
        .eq('id', documentId);
      
      return { error: deleteError };
    } catch (error) {
      console.error('Error deleting vaccine document:', error);
      return { error };
    }
  },
  
  /**
   * Update vaccine document notes
   */
  async updateVaccineDocument(documentId: string, notes: string): Promise<{ data: VaccineDocument | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('vaccine_documents')
        .update({ notes })
        .eq('id', documentId)
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating vaccine document:', error);
      return { data: null, error };
    }
  }
};
