import { supabase } from '../lib/supabase';

export const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  
    if (error) throw error;
    return data;
  };