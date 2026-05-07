'use client';

import { CardCatto } from '@ccatto/ui';
import { useTranslations } from 'next-intl';
import SignInEmailPassFormCatto from '@atomic-design/molecules/Auth/SignInEmailPassFormCatto';

const LoginCatto = () => {
  const t = useTranslations('auth');

  return (
    <>
      <div className="mt-6 h-full">
        <CardCatto
          title={t('signIn.cardTitle')}
          width="5xl"
          variant="midnightEmber"
          headerComponent={<SignInEmailPassFormCatto />}
        />
      </div>
    </>
  );
};

export default LoginCatto;
