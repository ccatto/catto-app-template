import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LoginCatto from '@atomic-design/atoms/Auth/LoginCatto';
import JumbotronFlexibleCatto from '@atomic-design/molecules/JumbotronCattoFlexible';

export const metadata: Metadata = {
  title: 'MyApp Sign In',
  description: 'MyApp Sign In - Login to MyApp to your account',
  alternates: {
    canonical: 'https://www.example.com/signin',
    languages: {
      en: 'https://www.example.com/en/signin',
      es: 'https://www.example.com/es/signin',
      pt: 'https://www.example.com/pt/signin',
      zh: 'https://www.example.com/zh/signin',
      vi: 'https://www.example.com/vi/signin',
      hi: 'https://www.example.com/hi/signin',
      fr: 'https://www.example.com/fr/signin',
      de: 'https://www.example.com/de/signin',
      'x-default': 'https://www.example.com/signin',
    },
  },
};

const Page = async () => {
  const t = await getTranslations('auth');

  return (
    <>
      <hr className="m-1" />
      <div className="hidden lg:block">
        <JumbotronFlexibleCatto
          title={t('signInPageTitle')}
          description={t('tagline')}
        />
      </div>
      <LoginCatto />
      <hr className="m-3" />
    </>
  );
};
export default Page;
