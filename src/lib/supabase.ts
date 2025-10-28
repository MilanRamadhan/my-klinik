// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Client untuk browser (dengan persistSession)
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 5,
    },
  },
});

// Client untuk server-side API routes (tanpa persistSession)
export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
