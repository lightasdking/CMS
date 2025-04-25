import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Allow sign-in page to be accessed without authentication
  // Handle both /sign-in and / (root) as sign-in paths due to optional catch-all routing
  if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/sign-in")) {
    // For unauthenticated users, show sign-in page
    // For authenticated users, proceed (will be redirected to dashboard below)
    return NextResponse.next();
  }

  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!role) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Match prefix-based access rules
  for (const [prefix, allowedRoles] of Object.entries(routeAccessMap)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
