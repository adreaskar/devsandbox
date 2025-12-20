import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = ["/", "/login", "/forgot-password"].includes(
    nextUrl.pathname
  );

  // Skip middleware for API routes
  if (isApiRoute) {
    return null;
  }

  // Redirect to dashboard if user is logged in the route is an auth route
  if (isAuthRoute && isLoggedIn) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard/overview", nextUrl));
    }
    return null;
  }

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  // Matches everything except static files and API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
