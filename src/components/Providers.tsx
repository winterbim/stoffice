'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';

/** Only load SessionProvider on pages that need auth (dashboard, login, api) */
const AUTH_PATHS = ['/dashboard', '/login'];

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const needsAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (!needsAuth) return <>{children}</>;

  return <SessionProvider>{children}</SessionProvider>;
}
