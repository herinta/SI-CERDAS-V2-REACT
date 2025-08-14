import { createClient } from '@supabase/supabase-js'

// Membaca environment variables dari Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// Membuat klien Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)