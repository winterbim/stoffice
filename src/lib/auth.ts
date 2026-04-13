import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

/**
 * Auth configuration — MVP mode (next-auth v4).
 * Uses environment variables for demo admin credentials.
 * Prisma/DB integration planned for production multi-tenant phase.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminHash) return null;
        if (credentials.email !== adminEmail) return null;

        const isValid = await bcrypt.compare(credentials.password, adminHash);
        if (!isValid) return null;

        return {
          id: 'admin-1',
          email: adminEmail,
          name: process.env.ADMIN_NAME || 'Admin',
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
};
