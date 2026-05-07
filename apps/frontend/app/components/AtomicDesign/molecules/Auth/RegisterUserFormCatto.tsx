// app/components/AtomicDesign/molecules/Auth/RegisterUserFormCatto.tsx
'use client';

import { useState } from 'react';
import { ButtonCatto, InputCatto } from '@ccatto/ui';
import { useTranslations } from 'next-intl';
import { signUp } from '@lib/auth-client-better';
import { useRouter } from '@/navigation';

const RegisterUserFormCatto = () => {
  const t = useTranslations('auth');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await signUp.email({ email, password, name });
      if (result?.error) {
        setError(result.error.message ?? t('register.errorGeneric'));
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('register.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <InputCatto
        type="text"
        label={t('register.nameLabel')}
        value={name}
        onChange={(value) => setName(value)}
        required
        autoComplete="name"
      />
      <InputCatto
        type="email"
        label={t('register.emailLabel')}
        value={email}
        onChange={(value) => setEmail(value)}
        required
        autoComplete="email"
      />
      <InputCatto
        type="password"
        label={t('register.passwordLabel')}
        value={password}
        onChange={(value) => setPassword(value)}
        required
        autoComplete="new-password"
        minLength={8}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <ButtonCatto type="submit" variant="primary" disabled={submitting}>
        {submitting ? t('register.submitting') : t('register.submit')}
      </ButtonCatto>
    </form>
  );
};

export default RegisterUserFormCatto;
