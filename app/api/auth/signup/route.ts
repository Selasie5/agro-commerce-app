import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';
import { User } from '../../../lib/types';

export async function POST(request: Request) {
  const { email, password, role, first_name, last_name }: Partial<User> = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const { data: { user }, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: userData, error: dbError } = await supabase
    .from('users')
    .insert([{ id: user?.id, email, role: role || 'user', first_name, last_name }]);

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ user });
}