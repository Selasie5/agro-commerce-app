import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC__SUPABASE_DB_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_DB_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);