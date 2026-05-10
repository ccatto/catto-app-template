'use client';

import { useTranslations } from 'next-intl';
import { CardCatto } from '@ccatto/ui';
import { UserProfileFormCatto } from '@ccatto/auth-ui';
import { useSession } from '@lib/auth-client-compat';
import { authClient } from '@lib/auth-client-better';
import { useRouter } from '@/navigation';

export default function ProfileClient() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { data: session, status, update } = useSession();

  if (status === 'loading') {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('profile.submitting')}
      </p>
    );
  }

  if (!session?.user) {
    router.push('/signin');
    return null;
  }

  const initialValues = {
    name: session.user.name ?? '',
    email: session.user.email ?? '',
  };

  return (
    <CardCatto width="full" title={t('profile.cardTitle')}>
      <UserProfileFormCatto
        initialValues={initialValues}
        onSubmit={async ({ name, email }) => {
          if (email !== initialValues.email) {
            // Better Auth handles email change via a verification flow that
            // sends a confirmation link. The bare-bones template doesn't
            // wire that up; product apps should add it explicitly.
            throw new Error(
              'Email changes are not yet supported. Contact support if you need to change your email.',
            );
          }
          if (name !== initialValues.name) {
            const result = await authClient.updateUser({ name });
            if (result?.error) {
              throw new Error(
                result.error.message ?? t('profile.errorGeneric'),
              );
            }
            await update();
          }
        }}
      />
    </CardCatto>
  );
}
