
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

serve(async (req) => {
  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create storage buckets
    const buckets = [
      {
        name: 'pet-profile-pictures',
        options: {
          public: true,
          fileSizeLimit: 2097152, // 2MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        }
      },
      {
        name: 'pet-vaccine-documents',
        options: {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
        }
      }
    ];

    const results = [];
    for (const bucket of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBuckets } = await supabaseAdmin
          .storage
          .listBuckets();
          
        const bucketExists = existingBuckets?.some(b => b.name === bucket.name);
        
        if (!bucketExists) {
          const { data, error } = await supabaseAdmin
            .storage
            .createBucket(bucket.name, bucket.options);
            
          if (error) {
            results.push({ bucket: bucket.name, status: 'error', message: error.message });
          } else {
            results.push({ bucket: bucket.name, status: 'created' });
          }
        } else {
          results.push({ bucket: bucket.name, status: 'already exists' });
        }
      } catch (err) {
        results.push({ bucket: bucket.name, status: 'error', message: err.message });
      }
    }

    // Create storage policies
    for (const bucket of buckets) {
      try {
        // Allow public read access
        await supabaseAdmin
          .storage
          .from(bucket.name)
          .createSignedUrl('dummy-path', 1); // This will fail but ensures bucket exists
          
        // Set policy for authenticated users to upload their own files
        const { error: policyError } = await supabaseAdmin.rpc(
          'create_storage_policy',
          {
            bucket_name: bucket.name,
            policy_name: `${bucket.name}_insert_policy`,
            definition: 'auth.uid() = owner',
            operation: 'INSERT'
          }
        );
        
        if (policyError) {
          results.push({ policy: `${bucket.name}_insert_policy`, status: 'error', message: policyError.message });
        } else {
          results.push({ policy: `${bucket.name}_insert_policy`, status: 'created' });
        }
      } catch (err) {
        // Ignore errors - policies may already exist
      }
    }

    return new Response(JSON.stringify({ 
      message: "Storage setup completed", 
      results
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
