// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qfqnctbatpreuberetga.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcW5jdGJhdHByZXViZXJldGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjQ3NTksImV4cCI6MjA1OTgwMDc1OX0.GNQVoCSAIDfMdJ5GGkPx1pH08R8vJTQBVOUwBO4a-WA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);