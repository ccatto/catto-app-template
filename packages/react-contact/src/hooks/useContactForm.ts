// @catto/react-contact — Main contact form hook

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLogger } from '../logger';
import { createContactSchema } from '../schema/contactSchema';
import type {
  ContactFormData,
  UseContactFormConfig,
  UseContactFormReturn,
} from '../types';
import { useRecaptcha } from './useRecaptcha';

/**
 * React hook for contact form management.
 *
 * Wraps React Hook Form + Zod validation + reCAPTCHA v3 into a single hook.
 * Consumers provide an onSubmit callback and get back everything needed to
 * render and manage a contact form.
 *
 * @param config - Form configuration
 */
export function useContactForm(
  config: UseContactFormConfig,
): UseContactFormReturn {
  const {
    schema: schemaConfig,
    onSubmit,
    recaptchaSiteKey,
    defaultValues,
  } = config;
  const log = getLogger();

  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Build Zod schema from config
  const zodSchema = createContactSchema(schemaConfig);

  // reCAPTCHA integration
  const { ready: recaptchaReady, executeRecaptcha } =
    useRecaptcha(recaptchaSiteKey);

  // React Hook Form setup
  const form = useForm<ContactFormData>({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  // Wrapped submit handler
  const handleSubmit = useCallback(
    async (e?: React.BaseSyntheticEvent) => {
      return rhfHandleSubmit(async (data: ContactFormData) => {
        setFormError('');
        try {
          // Get reCAPTCHA token if configured
          const recaptchaToken = await executeRecaptcha();

          // Clean empty optional fields to undefined
          const cleanedData: ContactFormData = {
            ...data,
            senderEmail: data.senderEmail || undefined,
            senderPhone: data.senderPhone || undefined,
          };

          await onSubmit(cleanedData, recaptchaToken);
          setIsSuccess(true);
          form.reset();
          log.info('Contact form submitted successfully');
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'An unexpected error occurred';
          setFormError(message);
          log.error('Contact form submission failed', { error: message });
        }
      })(e);
    },
    [rhfHandleSubmit, executeRecaptcha, onSubmit, form, log],
  );

  // Reset everything
  const reset = useCallback(() => {
    form.reset();
    setIsSuccess(false);
    setFormError('');
  }, [form]);

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isSuccess,
    formError,
    reset,
    recaptchaReady,
    form,
  };
}
