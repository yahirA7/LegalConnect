import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/buscar", "/abogados"];
const AUTH_PATHS = ["/login", "/signup"];
const LAWYER_PATHS = ["/abogado", "/abogado/dashboard", "/abogado/perfil", "/abogado/citas"];
const CLIENT_PATHS = ["/cliente", "/cliente/dashboard", "/cliente/citas", "/cliente/reservas"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

function isLawyerPath(pathname: string): boolean {
  return LAWYER_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

function isClientPath(pathname: string): boolean {
  return CLIENT_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("session")?.value;
  const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
  const roleCookie = session?.role ?? (request.cookies.get("userRole")?.value as "abogado" | "cliente" | undefined);
  const isAuthenticated = !!session && !!roleCookie;

  if (isAuthPath(pathname) && isAuthenticated) {
    const redirectUrl = roleCookie === "abogado" ? "/abogado/dashboard" : "/cliente/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (!isPublicPath(pathname) && !isAuthPath(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLawyerPath(pathname) && roleCookie !== "abogado") {
      return NextResponse.redirect(new URL("/cliente/dashboard", request.url));
    }

    if (isClientPath(pathname) && roleCookie !== "cliente") {
      return NextResponse.redirect(new URL("/abogado/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
