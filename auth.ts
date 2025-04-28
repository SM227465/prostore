import NextAuth, { type NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import Credentials from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  adapter: PrismaAdapter(prisma),

  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },

      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string, password: credentials.password as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isMatch = compareSync(credentials.password as string, user.password);

        if (!isMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user, trigger }: any) {
      session.user.id = token.sub;

      if (trigger === 'update') {
        session.user.name = user.name;
      }

      return session;
    },
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(config);
