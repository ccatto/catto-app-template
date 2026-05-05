// app/components/AtomicDesign/atoms/Auth/NavButtonsCatto.tsx
// Supports both NextAuth (web/OAuth) and JWT (mobile/Capacitor) authentication
'use client';

import { LinkCatto, TooltipCatto } from '@ccatto/ui';
import { Home, LayoutDashboard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcherCatto from '@atomic-design/atoms/ControlsCatto/LanguageSwitcherCatto';
import MessagesBellCatto from '@atomic-design/atoms/Messaging/MessagesBellCatto';
import NotificationBellCatto from '@atomic-design/atoms/Notifications/NotificationBellCatto';
import { useSession } from '@lib/auth-client-compat';
import { useAuth } from '@lib/hooks/useAuth';
import { useDefaultOrg } from '@lib/hooks/useDefaultOrg';
import LinkAccountCatto from './LinkAccountCatto';
import LinkSignInCatto from './LinkSignInCatto';

const NavButtonsCatto = () => {
  const t = useTranslations('nav');
  // Check NextAuth session (for OAuth users)
  const { data: session, status } = useSession();

  // Check JWT auth (for email/password users and mobile)
  const { isAuthenticated: jwtAuthenticated, isLoading: jwtLoading } =
    useAuth();

  // Check for error message in session data
  const hasSessionError = session && 'message' in session;
  const nextAuthAuthenticated = !hasSessionError && status === 'authenticated';

  // User is authenticated if either system says so
  const isAuthenticated = nextAuthAuthenticated || jwtAuthenticated;

  // Show loading state while checking auth
  const isLoading = status === 'loading' || jwtLoading;

  // Home org (only fetched when authenticated)
  const { defaultOrg, hasDefaultOrg } = useDefaultOrg();

  // Don't flash wrong button while loading
  if (isLoading) {
    return null;
  }

  // Authenticated users see Dashboard + Home Org + Account links
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        {/* Home Org Button */}
        {hasDefaultOrg && defaultOrg && (
          <TooltipCatto
            content={defaultOrg.name}
            position="bottom"
            variant="orange"
          >
            <LinkCatto
              href={`/${defaultOrg.slug}`}
              variant="outline"
              className="flex items-center"
              aria-label={defaultOrg.name}
            >
              <Home className="mr-2 h-4 w-4" />
              {t('homeOrg')}
            </LinkCatto>
          </TooltipCatto>
        )}
        <TooltipCatto
          content="Your teams, tournaments, leagues, and activity"
          position="bottom"
          variant="orange"
          maxWidth="400px"
          tooltipClassName="whitespace-nowrap"
        >
          <LinkCatto
            href="/my-myapp"
            variant="outline"
            className="flex items-center"
            aria-label={t('myMyApp')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t('myMyApp')}</span>
            <span className="sm:hidden">{t('myRz')}</span>
          </LinkCatto>
        </TooltipCatto>
        <NotificationBellCatto />
        <MessagesBellCatto />
        <LanguageSwitcherCatto variant="compact" showFlags={true} />
        <LinkAccountCatto />
      </div>
    );
  }

  // Unauthenticated: Language switcher + Sign In
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcherCatto variant="compact" showFlags={true} />
      <LinkSignInCatto />
    </div>
  );
};

export default NavButtonsCatto;
