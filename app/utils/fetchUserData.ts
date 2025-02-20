import { supabase } from '../lib/supabase';

export const fetchUserData = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }

  if (!data) {
    throw new Error('User not found');
  }

  return data;
};