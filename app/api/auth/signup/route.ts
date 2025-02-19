import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';
import { User } from '../../../lib/types';

export async function POST(request: Request) {
  const { email, password, role, first_name, last_name }: Partial<User> = await request.json();

  // Validate required fields
  if (!email || !password || !first_name || !last_name || !role) {
    return NextResponse.json(
      { error: 'Email, password, first name, last name, and role are required' },
      { status: 400 }
    );
  }

  // Validate role
  if (role !== 'user' && role !== 'admin') {
    return NextResponse.json(
      { error: 'Invalid role. Role must be either "user" or "admin"' },
      { status: 400 }
    );
  }

  // Sign up the user with Supabase Auth
  const { data: { user }, error: authError } = await supabase.auth.signUp({ email, password });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (!user) {
    return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
  }

  // Insert user data into the `users` table
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .insert([{ id: user.id, email, role, first_name, last_name }]);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ user: { ...user, role, first_name, last_name } });
}