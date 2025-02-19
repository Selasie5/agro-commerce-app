'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '../../lib/types';

async function fetchUserData(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user data:', error);
    return null;
  }

  return data;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        if (user?.data?.user?.id) {
          const userData = await fetchUserData(user.data.user.id);
          setUser(userData);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {user && (
        <p>
          Welcome, {user.first_name} {user.last_name}!
        </p>
      )}
    </div>
  );
}