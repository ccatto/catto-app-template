// app/components/AtomicDesign/molecules/Auth/SignInEmailPassFormCatto.tsx
'use client';

import { useState } from 'react';
import { ButtonCatto, InputCatto } from '@ccatto/ui';
import { useTranslations } from 'next-intl';
import { signIn } from '@lib/auth-client-better';
import { useRouter } from '@/navigation';

const SignInEmailPassFormCatto = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await signIn.email({ email, password });
      if (result?.error) {
        setError(result.error.message ?? t('signIn.errorGeneric'));
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('signIn.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <InputCatto
        type="email"
        label={t('signIn.emailLabel')}
        value={email}
        onChange={(value) => setEmail(value)}
        required
        autoComplete="email"
      />
      <InputCatto
        type="password"
        label={t('signIn.passwordLabel')}
        value={password}
        onChange={(value) => setPassword(value)}
        required
        autoComplete="current-password"
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <ButtonCatto type="submit" variant="primary" disabled={submitting}>
        {submitting ? t('signIn.submitting') : t('signIn.submit')}
      </ButtonCatto>
    </form>
  );
};

export default SignInEmailPassFormCatto;
