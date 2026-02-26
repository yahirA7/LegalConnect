import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import type { UserRole } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let uid: string | undefined;
    let role: UserRole | undefined;
    let redirect: string | undefined;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      uid = body.uid;
      role = body.role;
      redirect = body.redirect;
    } else {
      const formData = await request.formData();
      uid = (formData.get("uid") as string | null) ?? undefined;
      role = (formData.get("role") as UserRole | null) ?? undefined;
      redirect = (formData.get("redirect") as string | null) ?? undefined;
    }

    if (!uid || !role || !["abogado", "cliente"].includes(role as string)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const token = await createSessionToken(uid, role as UserRole);

    const destination =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : role === "abogado"
          ? "/abogado/dashboard"
          : "/cliente/dashboard";

    const response = NextResponse.redirect(new URL(destination, request.url), 302);
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });
    response.cookies.set("userRole", role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Error al crear sesión" }, { status: 500 });
  }
}
