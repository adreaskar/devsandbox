import { NextResponse } from "next/server";

export function proxy(request) {}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
