import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { verifyOtp } from "@/lib/otp";

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

        if (!phone || !code) return null;

        const verification = await prisma.phoneVerification.findFirst({
          where: {
            phone,
            verified: false,
            expiresAt: { gte: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!verification) return null;
        if (verification.attempts >= 5) return null;

        await prisma.phoneVerification.update({
          where: { id: verification.id },
          data: { attempts: { increment: 1 } },
        });

        const valid = await verifyOtp(code, verification.code);
        if (!valid) return null;

        await prisma.phoneVerification.update({
          where: { id: verification.id },
          data: { verified: true },
        });

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

        await prisma.phoneVerification.deleteMany({
          where: {
            phone,
            id: { not: verification.id },
          },
        });

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
