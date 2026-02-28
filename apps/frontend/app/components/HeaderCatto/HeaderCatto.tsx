'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useSession } from '@lib/auth-client-compat';

export default function HeaderCatto() {
  const t = useTranslations('navigation');
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo / App Name */}
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-50">
          {/* TODO: Replace with your app name */}
          My App
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
          >
            {t('home')}
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
          >
            {t('about')}
          </Link>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
            >
              {t('dashboard')}
            </Link>
          ) : (
            <Link
              href="/signin"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('signIn')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
