import { NextResponse, type NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth-new"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Get token from Authorization header or cookie
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7)
    : request.cookies.get('auth-token')?.value

  let user = null
  if (token) {
    const decoded = verifyToken(token)
    if (decoded) {
      user = { id: decoded.userId }
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to admin login page
    if (request.nextUrl.pathname === "/admin") {
      return response
    }

    // For other admin routes, check if user is admin
    if (!user) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (user && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
