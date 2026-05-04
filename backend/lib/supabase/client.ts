import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client menggunakan anon key.
 * Digunakan untuk operasi yang bisa dilakukan oleh user biasa (public).
 * RLS (Row Level Security) berlaku pada client ini.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
