import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface AdminSessionData {
  isLoggedIn: boolean;
  adminEmail?: string;
}

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  "smartspace-admin-fallback-secret-change-in-production-32chars";

export const sessionOptions = {
  password: SESSION_SECRET,
  cookieName: "ss_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSessionData>(cookieStore, sessionOptions);
  return session;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  return session.isLoggedIn === true ? session : null;
}
