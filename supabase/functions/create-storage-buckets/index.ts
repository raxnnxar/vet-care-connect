
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization")!,
          },
        },
      }
    );

    // Check if the pet-profile-pictures bucket exists
    const { data: buckets, error: bucketsError } = await supabaseClient
      .storage
      .listBuckets();

    if (bucketsError) {
      throw bucketsError;
    }

    // Create pet-profile-pictures bucket if it doesn't exist
    const petProfilePicturesBucket = buckets?.find(bucket => bucket.name === 'pet-profile-pictures');
    if (!petProfilePicturesBucket) {
      const { data, error } = await supabaseClient
        .storage
        .createBucket('pet-profile-pictures', {
          public: true,
          fileSizeLimit: 2097152, // 2MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });

      if (error) {
        throw error;
      }
    }

    // Create pet-vaccine-documents bucket if it doesn't exist
    const petVaccineDocumentsBucket = buckets?.find(bucket => bucket.name === 'pet-vaccine-documents');
    if (!petVaccineDocumentsBucket) {
      const { data, error } = await supabaseClient
        .storage
        .createBucket('pet-vaccine-documents', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
        });

      if (error) {
        throw error;
      }
    }

    return new Response(JSON.stringify({ 
      message: "Storage buckets created successfully", 
      buckets: ['pet-profile-pictures', 'pet-vaccine-documents']
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
