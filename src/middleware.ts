import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip calling auto-task endpoint itself
  if (pathname.startsWith('/api/auto')) {
    return NextResponse.next();
  }

  // Trigger task run
  fetch('http://localhost:3000/api/auto').catch(() =>
    console.error('❌ Failed to trigger task')
  );

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

