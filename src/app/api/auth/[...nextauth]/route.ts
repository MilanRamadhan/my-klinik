// src/app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs";

import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV === "development",
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;

        // cari user
        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user) return null;

        // verifikasi password
        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) return null;

        // return payload user untuk JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  pages: { signIn: "/auth/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
