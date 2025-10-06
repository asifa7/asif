// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // In local quick-run mode these may be undefined; that's okay.
  // Calls that rely on supabase should check for these variables.
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
