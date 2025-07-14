

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected API routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/api/menus(.*)',
  '/api/categories(.*)',
  '/api/menu-items(.*)',
  '/api/tags' // POST /api/tags requires auth, GET is public
]);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/api/health',
  '/api/menus/share/(.*)', // Public menu sharing
  '/api/tags' // GET tags is public (POST will be handled by individual route)
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes to pass through
  if (isPublicRoute(req)) {
    return;
  }
  
  // Protect API routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};