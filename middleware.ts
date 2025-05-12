import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  // Get the pathname of the request
  const { pathname } = request.nextUrl
  
  // Define protected routes
  const protectedRoutes = ['/dashboard']
  
  // Check if the pathname starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Allow access to auth-related routes
  const isAuthRoute = pathname.startsWith('/login') || 
                      pathname.startsWith('/register') || 
                      pathname.startsWith('/forgot-password')
  
  // If no token and trying to access a protected route
  if (!token && isProtectedRoute) {
    // Redirect to login page
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(loginUrl)
  }
  
  // If token exists and user is trying to access login or register page
  if (token && isAuthRoute) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If token exists but the user's status is not approved, redirect to pending page
  if (token && isProtectedRoute && token.status !== 'approved') {
    // Only if they're not already on the pending page
    if (!pathname.startsWith('/pending-status')) {
      return NextResponse.redirect(new URL('/pending-status', request.url))
    }
  }
  
  return NextResponse.next()
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    // Match all routes that start with dashboard
    '/dashboard/:path*',
    // Match login and register pages
    '/login',
    '/register',
    '/forgot-password',
    '/pending-status',
  ],
}

export default middleware;
