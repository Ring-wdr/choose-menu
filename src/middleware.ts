import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const hasUserName = request.cookies.has("userName");
  if (request.nextUrl.pathname === "/" && hasUserName)
    return NextResponse.redirect(new URL("/menu", request.url));
  if (request.nextUrl.pathname.startsWith("/menu") && !hasUserName)
    return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/", "/menu"],
};
