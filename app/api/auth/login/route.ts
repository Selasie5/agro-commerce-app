import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';
import { User } from '../../../lib/types';

export async function POST(request: Request) {
  const { email, password }: Partial<User> = await request.json();

  // Validate required fields
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Sign in the user with Supabase Auth
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    console.error('Auth Error:', authError);
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  if (!user) {
    console.error('User is undefined');
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }

  console.log('User:', user); // Log the user object

  // Fetch the user's role from the `users` table
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (dbError) {
    console.error('Database Error:', dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ user: { ...user, role: userData.role } });
}