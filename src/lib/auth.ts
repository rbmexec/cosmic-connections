import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { checkVerification } from "@/lib/twilio";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Resend({
      from: "astr <noreply@astr8.ai>",
    }),
    Credentials({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const phone = credentials?.phone as string | undefined;
        const code = credentials?.code as string | undefined;

        if (!phone || !code) {
          console.log("[auth] Missing phone or code", { phone: !!phone, code: !!code });
          return null;
        }

        try {
          const { status, valid } = await checkVerification(phone, code);
          console.log("[auth] Twilio verify result:", { phone, status, valid });
          if (status !== "approved" || !valid) return null;
        } catch (err) {
          console.error("[auth] Twilio checkVerification error:", err);
          return null;
        }

        let user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone,
              phoneVerified: new Date(),
            },
          });

          await prisma.account.create({
            data: {
              userId: user.id,
              type: "credentials",
              provider: "phone-otp",
              providerAccountId: phone,
            },
          });
        } else if (!user.phoneVerified) {
          await prisma.user.update({
            where: { id: user.id },
            data: { phoneVerified: new Date() },
          });
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    signIn({ user, account }) {
      console.log(
        `[auth] Sign-in: ${user.email ?? user.id} via ${account?.provider}`
      );
    },
  },
  logger: {
    error(error) {
      console.error("[auth] Error:", error);
    },
    warn(code) {
      console.warn("[auth] Warning:", code);
    },
  },
});
