// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('isLoggedIn');
  const path = request.nextUrl.pathname;

  // Debug logs
  console.log('Current path:', path);
  console.log('Is logged in:', isLoggedIn);

  if (!isLoggedIn && path.startsWith('/dashboard')) {
    console.log('Redirecting to login'); // Debug log
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isLoggedIn && path === '/') {
    console.log('Redirecting to dashboard'); // Debug log
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
};