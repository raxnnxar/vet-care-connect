
// This is an edge function to create required storage buckets
// This will be run when the app is deployed

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    
    // Create the required buckets
    const buckets = [
      {
        id: "pet-owners-profile-pictures",
        name: "Pet Owners Profile Pictures",
        public: true,
      },
      {
        id: "pet-profile-pictures",
        name: "Pet Profile Pictures",
        public: true,
      },
    ];
    
    const results = [];
    
    // Create each bucket
    for (const bucket of buckets) {
      try {
        const { data, error } = await supabaseAdmin.storage.createBucket(
          bucket.id, 
          { 
            public: bucket.public,
            fileSizeLimit: 1024 * 1024 * 5, // 5MB limit
          }
        );
        
        if (error) {
          results.push({ bucket: bucket.id, status: "error", message: error.message });
        } else {
          results.push({ bucket: bucket.id, status: "success" });
        }
      } catch (error) {
        // If the bucket already exists, this is fine
        if (error.message.includes("already exists")) {
          results.push({ bucket: bucket.id, status: "exists" });
        } else {
          results.push({ bucket: bucket.id, status: "error", message: error.message });
        }
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, results }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
