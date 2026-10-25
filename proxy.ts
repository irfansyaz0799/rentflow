import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Get session cookie
  const session = request.cookies.get('rentflow_session')?.value
  
  // Protect owner and tenant routes
  if (request.nextUrl.pathname.startsWith('/owner') || request.nextUrl.pathname.startsWith('/tenant')) {
    if (!session) return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/owner/:path*', '/tenant/:path*'],
}