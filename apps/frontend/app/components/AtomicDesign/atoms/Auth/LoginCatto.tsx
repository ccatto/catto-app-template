'use client';

import { CardCatto } from '@catto/ui';
import { useTranslations } from 'next-intl';
import SignInEntireFormCatto from '@atomic-design//molecules/Auth/SignInEntireFormCatto';

const LoginCatto = () => {
  const t = useTranslations('auth');

  return (
    <>
      <div className="mt-6 h-full">
        <CardCatto
          title={t('signIn.cardTitle')}
          width="5xl"
          variant="midnightEmber"
          headerComponent={<SignInEntireFormCatto />}
        />
      </div>
    </>
  );
};

export default LoginCatto;
