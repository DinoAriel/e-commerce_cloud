import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Supabase admin client menggunakan service role key.
 * HANYA digunakan di server-side (API routes).
 * Client ini BYPASS semua RLS policies — gunakan dengan hati-hati.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
