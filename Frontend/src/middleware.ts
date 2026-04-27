//import { authMiddleware } from '@clerk/nextjs';

//export default authMiddleware({
//  publicRoutes: ['/', '/sign-in', '/sign-up', '/api((?!.*).*)'],
//});

//export const config = {
//  matcher: [
//    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//    '/(api|trpc)(.*)',
//  ],
//};

export default function middleware() {
  // do nothing (Clerk disabled)
  return;
}

export const config = {
  matcher: ['/((?!.*\\.).*)'],
};