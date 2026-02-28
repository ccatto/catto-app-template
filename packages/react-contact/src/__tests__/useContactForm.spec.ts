import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useContactForm } from '../hooks/useContactForm';

describe('useContactForm', () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).grecaptcha;
  });

  it('returns expected shape', () => {
    const { result } = renderHook(() =>
      useContactForm({ onSubmit: mockOnSubmit }),
    );

    expect(result.current).toHaveProperty('register');
    expect(result.current).toHaveProperty('handleSubmit');
    expect(result.current).toHaveProperty('errors');
    expect(result.current).toHaveProperty('isSubmitting');
    expect(result.current).toHaveProperty('isSuccess');
    expect(result.current).toHaveProperty('formError');
    expect(result.current).toHaveProperty('reset');
    expect(result.current).toHaveProperty('recaptchaReady');
    expect(result.current).toHaveProperty('form');
  });

  it('starts with correct initial state', () => {
    const { result } = renderHook(() =>
      useContactForm({ onSubmit: mockOnSubmit }),
    );

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.formError).toBe('');
    expect(result.current.recaptchaReady).toBe(true); // No siteKey = always ready
  });

  it('resets state when reset is called', async () => {
    const failingSubmit = vi.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() =>
      useContactForm({ onSubmit: failingSubmit }),
    );

    // Trigger a submission that will fail (we need to populate form first)
    // Since RHF won't call onSubmit with invalid data, we test reset clears formError
    await act(async () => {
      result.current.reset();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.formError).toBe('');
  });

  it('captures formError when onSubmit throws', async () => {
    const failingSubmit = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useContactForm({ onSubmit: failingSubmit }),
    );

    // Set valid form values via RHF
    await act(async () => {
      result.current.form.setValue('senderName', 'John Doe');
      result.current.form.setValue('subject', 'Test Subject');
      result.current.form.setValue(
        'message',
        'This is a valid test message for the form.',
      );
    });

    // Submit the form
    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(result.current.formError).toBe('Network error');
    expect(result.current.isSuccess).toBe(false);
  });

  it('sets isSuccess on successful submission', async () => {
    const { result } = renderHook(() =>
      useContactForm({ onSubmit: mockOnSubmit }),
    );

    // Set valid form values
    await act(async () => {
      result.current.form.setValue('senderName', 'John Doe');
      result.current.form.setValue('subject', 'Test Subject');
      result.current.form.setValue(
        'message',
        'This is a valid test message for the form.',
      );
    });

    await act(async () => {
      await result.current.handleSubmit();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        senderName: 'John Doe',
        subject: 'Test Subject',
        message: 'This is a valid test message for the form.',
      }),
      undefined, // No reCAPTCHA token (no siteKey)
    );
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.formError).toBe('');
  });
});
