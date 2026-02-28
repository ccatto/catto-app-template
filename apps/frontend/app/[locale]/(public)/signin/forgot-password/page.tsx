// page signIn/Forgot-password
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ForgotPasswordFormCatto from '@atomic-design/molecules/Auth/ForgotPasswordCatto';
import JumbotronFlexibleCatto from '@atomic-design/molecules/JumbotronCattoFlexible';

export const metadata: Metadata = {
  title: 'MyApp SignIn Forgot Password',
  description:
    'MyApp SignIn Forgot Password - Forgot password for an existing user to MyApp to your account',
  alternates: {
    canonical: 'https://www.example.com/signin/forgot-password',
    languages: {
      en: 'https://www.example.com/en/signin/forgot-password',
      es: 'https://www.example.com/es/signin/forgot-password',
      pt: 'https://www.example.com/pt/signin/forgot-password',
      zh: 'https://www.example.com/zh/signin/forgot-password',
      vi: 'https://www.example.com/vi/signin/forgot-password',
      hi: 'https://www.example.com/hi/signin/forgot-password',
      fr: 'https://www.example.com/fr/signin/forgot-password',
      de: 'https://www.example.com/de/signin/forgot-password',
      'x-default': 'https://www.example.com/signin/forgot-password',
    },
  },
};

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <hr className="m-1" />
      <JumbotronFlexibleCatto
        title={t('forgotPasswordPageTitle')}
        description={t('tagline')}
      />
      <ForgotPasswordFormCatto />
      <hr className="m-3" />
    </>
  );
};
export default Page;
