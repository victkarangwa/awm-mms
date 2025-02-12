import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken");
  const path = req.nextUrl.pathname;
  if (path.includes("login") && token?.value !== undefined) {
    return NextResponse.redirect(new URL("/admin/members", req.url));
  }

  // If no token, redirect to login
  if (path.includes("admin") && token?.value === undefined) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Protect login page from authenticated users and admin pages from unauthenticated users
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
