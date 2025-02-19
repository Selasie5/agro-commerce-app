import { supabase } from '../../../lib/supabase';
import { NextResponse } from 'next/server';
import { User } from '../../../lib/types';

export async function POST(request: Request) {
  const { email, password }: Partial<User> = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  const user = data?.user;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ user: { ...user, role: userData.role } });
}