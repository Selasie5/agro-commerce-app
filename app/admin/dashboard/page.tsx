'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchUserData } from '../lib/fetchUserData';
import { User } from '../lib/types';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        try {
          const userData = await fetchUserData(authUser.id);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <p>
          Welcome, {user.first_name} {user.last_name}!
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}