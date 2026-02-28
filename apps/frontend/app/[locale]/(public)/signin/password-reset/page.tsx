// page SignIn Password Reset
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PasswordResetCatto from '@atomic-design/molecules/Auth/PasswordResetCatto';
import JumbotronFlexibleCatto from '@atomic-design/molecules/JumbotronCattoFlexible';

export const metadata: Metadata = {
  title: 'MyApp SignIn Password Reset',
  description:
    'MyApp SignIn Password Reset password for an existing user to MyApp to your account',
  alternates: {
    canonical: 'https://www.example.com/signin/password-reset',
    languages: {
      en: 'https://www.example.com/en/signin/password-reset',
      es: 'https://www.example.com/es/signin/password-reset',
      pt: 'https://www.example.com/pt/signin/password-reset',
      zh: 'https://www.example.com/zh/signin/password-reset',
      vi: 'https://www.example.com/vi/signin/password-reset',
      hi: 'https://www.example.com/hi/signin/password-reset',
      fr: 'https://www.example.com/fr/signin/password-reset',
      de: 'https://www.example.com/de/signin/password-reset',
      'x-default': 'https://www.example.com/signin/password-reset',
    },
  },
};

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <hr className="m-1" />
      <JumbotronFlexibleCatto
        title={t('passwordResetPageTitle')}
        description={t('tagline')}
      />
      <PasswordResetCatto />
      <hr className="m-3" />
    </>
  );
};
export default Page;
