import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomUUID } from "node:crypto";
import { ensureGuestWorkspace, ensureUserWorkspace, findPasswordUser } from "./db";
import { verifyPassword } from "./password";
import { checkRateLimit } from "./rateLimit";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials, request) {
        const rate = await checkRateLimit({ headers: request.headers }, "login", 10, 15 * 60 * 1000);
        if (!rate.allowed) return null;
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || typeof password !== "string") return null;
        const user = await findPasswordUser(email);
        if (!user || !(await verifyPassword(password, user.password_hash))) return null;
        return { id: user.id, email: user.email, name: user.display_name };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
      : []),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      await ensureUserWorkspace({ id: user.id, email: user.email, name: user.name });
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const identity = await ensureUserWorkspace({ id: user.id, email: user.email, name: user.name });
        token.userId = identity.userId;
        token.workspaceId = identity.workspaceId;
        token.role = identity.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId || token.sub;
        session.user.workspaceId = token.workspaceId;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};

export function getAuthSession() {
  return getServerSession(authOptions);
}

export async function getAccessContext(request) {
  const session = await getAuthSession();
  if (session?.user?.id && session.user.workspaceId) {
    return { userId: session.user.id, workspaceId: session.user.workspaceId, isGuest: false };
  }

  const existingGuestId = request.cookies.get("redline_guest_id")?.value;
  const guestId = /^[0-9a-f-]{36}$/i.test(existingGuestId || "") ? existingGuestId : randomUUID();
  const identity = await ensureGuestWorkspace(guestId);
  return { ...identity, isGuest: true, guestId, isNewGuest: guestId !== existingGuestId };
}

export function attachGuestCookie(response, access) {
  if (access.isGuest && access.isNewGuest) {
    response.cookies.set("redline_guest_id", access.guestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return response;
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    const error = new Error("Sign in is required.");
    error.code = "AUTH_REQUIRED";
    error.status = 401;
    throw error;
  }
  return session;
}
