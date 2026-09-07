import NextAuth, { type NextAuthConfig, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified?: Date | null;
      firstName: string;
      lastName: string;
      roles: string[];
      permissions: string[];
      accessToken: string;
      refreshToken: string;
    };
  }

  interface User {
    id: string;
    email: string;
    emailVerified?: Date | null;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

const API_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    const refreshedData = data.data;

    return {
      ...token,
      accessToken: refreshedData.accessToken,
      refreshToken: refreshedData.refreshToken,
      accessTokenExpires: Date.now() + 14 * 60 * 1000, // 14 min
    };
  } catch {
    return { ...token, accessToken: "", refreshToken: "" };
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Invalid credentials");
          }

          const data = await response.json();
          const { accessToken, refreshToken, user } = data.data;

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles || [],
            permissions: user.permissions || [],
            accessToken,
            refreshToken,
          };
        } catch (error) {
          if (error instanceof Error) throw error;
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      // Initial sign in
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email!,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles,
          permissions: user.permissions,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 14 * 60 * 1000,
        };
      }

      // Return previous token if not expired
      if (Date.now() < (token.accessTokenExpires || 0)) {
        return token;
      }

      // Token expired, try refresh
      return refreshAccessToken(token);
    },
    async session({ session, token }): Promise<Session> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session as any).user = {
        id: token.id,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        roles: token.roles,
        permissions: token.permissions,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
