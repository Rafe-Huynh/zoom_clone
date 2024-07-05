import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoutes = createRouteMatcher(['/','/upcoming','/previous','/recordings', '/personal-room','/meeting(.*)'])
export default clerkMiddleware((auth, req) => {
    if(protectedRoutes(req)) auth().protect()
})

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};