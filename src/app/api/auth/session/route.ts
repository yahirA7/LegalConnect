import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import type { UserRole } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, role } = body as { uid?: string; role?: UserRole };

    if (!uid || !role || !["abogado", "cliente"].includes(role)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const token = await createSessionToken(uid, role);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });
    response.cookies.set("userRole", role, {
      httpOnly: false, // El cliente lo necesita para redirecciones
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
