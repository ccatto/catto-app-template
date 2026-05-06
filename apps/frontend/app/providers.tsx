'use client';

import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@ccatto/ui';
import ZustandHydration from '@zustand/ZustandHydration';
import ThemeProviderCatto from '@atomic-design/atoms/Utils/ThemeProviderCatto';
import { apolloClient } from '@lib/apollo-client';
import { BetterSessionProvider } from '@lib/auth-client-better';
import NetworkStatusProvider from './components/Providers/NetworkStatusProvider';
import PushNotificationProvider from './components/Providers/PushNotificationProvider';
import SessionSync from './components/Providers/SessionSync';
import ToastContainerCatto from './components/Utils/Toast/ToastContainerCatto';
import TopLoader from './components/Utils/Toploader/Toploader';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <BetterSessionProvider refetchInterval={5 * 60}>
        <SessionSync />
        <ZustandHydration />
        {/* Color theme provider */}
        <ThemeProvider defaultTheme="default">
          {/* Dark/light mode provider */}
          <ThemeProviderCatto>
            <TopLoader />
            <ToastContainerCatto />
            {/* Push notifications for mobile apps */}
            <PushNotificationProvider>
              {/* Network status banner */}
              <NetworkStatusProvider>
                {children}
              </NetworkStatusProvider>
            </PushNotificationProvider>
          </ThemeProviderCatto>
        </ThemeProvider>
      </BetterSessionProvider>
    </ApolloProvider>
  );
}
