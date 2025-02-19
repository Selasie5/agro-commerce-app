import { NextResponse } from 'next/server';
import { supabase } from './app/lib/supabase';

export async function middleware(request: Request) {
  const user = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user?.data?.user?.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (new URL(request.url).pathname.startsWith('/admin') && userData.role !== 'admin') {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/products', '/cart', '/wishlist'],
};