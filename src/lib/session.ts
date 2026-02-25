import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "./types";

const SESSION_COOKIE = "session";
const SESSION_SECRET = process.env.SESSION_SECRET || "fallback-dev-secret-change-in-production";
const SECRET = new TextEncoder().encode(SESSION_SECRET);

export interface SessionPayload {
  uid: string;
  role: UserRole;
  exp: number;
}

export async function createSessionToken(uid: string, role: UserRole): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 días
  return new SignJWT({ uid, role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .setIssuedAt()
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      uid: payload.uid as string,
      role: payload.role as UserRole,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
