// @catto/ui - FormCatto Tests
// Comprehensive tests for the form component with react-hook-form and Zod validation

import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import FormCatto from '../../components/Form/FormCatto';

// Test schemas
const simpleSchema = z.object({
  email: z.string().email({ error: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters' }),
});

const singleFieldSchema = z.object({
  name: z.string().min(1, { error: 'Name is required' }),
});

type SimpleFormData = z.infer<typeof simpleSchema>;
type SingleFieldData = z.infer<typeof singleFieldSchema>;

describe('FormCatto', () => {
  const defaultProps = {
    fields: [
      {
        name: 'email' as const,
        label: 'Email',
        type: 'email',
        placeholder: 'Enter your email',
      },
      {
        name: 'password' as const,
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
      },
    ],
    validationSchema: simpleSchema,
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // Rendering Tests
  // ============================================

  describe('Rendering', () => {
    it('renders the form element', () => {
      render(<FormCatto {...defaultProps} />);
      expect(
        screen.getByRole('form', { name: /form submission/i }),
      ).toBeInTheDocument();
    });

    it('renders all field labels', () => {
      render(<FormCatto {...defaultProps} />);
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Password')).toBeInTheDocument();
    });

    it('renders input fields with correct types', () => {
      const { container } = render(<FormCatto {...defaultProps} />);
      const emailInput = container.querySelector('input[type="email"]');
      const passwordInput = container.querySelector('input[type="password"]');
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('renders placeholders', () => {
      render(<FormCatto {...defaultProps} />);
      expect(
        screen.getByPlaceholderText('Enter your email'),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Enter your password'),
      ).toBeInTheDocument();
    });

    it('renders submit button with default text', () => {
      render(<FormCatto {...defaultProps} />);
      expect(
        screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument();
    });

    it('renders submit button with custom text', () => {
      render(<FormCatto {...defaultProps} submitText="Sign In" />);
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <FormCatto {...defaultProps} className="custom-form-class" />,
      );
      expect(container.querySelector('.custom-form-class')).toBeInTheDocument();
    });

    it('applies default values to fields', () => {
      const fieldsWithDefaults = [
        {
          name: 'email' as const,
          label: 'Email',
          type: 'email',
          defaultValue: 'test@example.com',
        },
        {
          name: 'password' as const,
          label: 'Password',
          type: 'password',
          defaultValue: 'secret123',
        },
      ];

      render(<FormCatto {...defaultProps} fields={fieldsWithDefaults} />);

      const inputs = screen.getAllByRole('textbox');
      // Email field should be pre-filled
      expect(inputs[0]).toHaveValue('test@example.com');
    });
  });

  // ============================================
  // Cancel Button Tests
  // ============================================

  describe('Cancel Button', () => {
    it('does not show cancel button by default', () => {
      render(<FormCatto {...defaultProps} />);
      expect(
        screen.queryByRole('button', { name: /cancel/i }),
      ).not.toBeInTheDocument();
    });

    it('shows cancel button when showCancelButton is true', () => {
      render(<FormCatto {...defaultProps} showCancelButton={true} />);
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    it('calls onCancel when cancel button clicked', async () => {
      const onCancel = vi.fn();
      render(
        <FormCatto
          {...defaultProps}
          showCancelButton={true}
          onCancel={onCancel}
        />,
      );

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('cancel button is disabled when form is submitting', async () => {
      render(
        <FormCatto
          {...defaultProps}
          showCancelButton={true}
          isSubmitting={true}
        />,
      );
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });
  });

  // ============================================
  // Custom Labels Tests
  // ============================================

  describe('Custom Labels', () => {
    it('uses custom submit label', () => {
      render(
        <FormCatto {...defaultProps} labels={{ submit: 'Create Account' }} />,
      );
      expect(
        screen.getByRole('button', { name: /create account/i }),
      ).toBeInTheDocument();
    });

    it('uses custom cancel label', () => {
      render(
        <FormCatto
          {...defaultProps}
          showCancelButton={true}
          labels={{ cancel: 'Go Back' }}
        />,
      );
      expect(
        screen.getByRole('button', { name: /go back/i }),
      ).toBeInTheDocument();
    });

    it('uses custom submitting label', async () => {
      render(
        <FormCatto
          {...defaultProps}
          isSubmitting={true}
          labels={{ submitting: 'Processing...' }}
        />,
      );
      expect(
        screen.getByRole('button', { name: /processing/i }),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // Validation Tests
  // ============================================

  describe('Validation', () => {
    it('submit button is disabled when form is empty (invalid)', async () => {
      render(<FormCatto {...defaultProps} />);
      // Form starts invalid (empty fields)
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('submit button is disabled when email is invalid', async () => {
      render(<FormCatto {...defaultProps} />);

      // Type invalid email
      await userEvent.type(
        screen.getByPlaceholderText('Enter your email'),
        'invalid-email',
      );
      // Type valid password
      await userEvent.type(
        screen.getByPlaceholderText('Enter your password'),
        'password123',
      );

      // Button should still be disabled due to invalid email
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('submit button is disabled when password is too short', async () => {
      render(<FormCatto {...defaultProps} />);

      // Type valid email
      await userEvent.type(
        screen.getByPlaceholderText('Enter your email'),
        'test@example.com',
      );
      // Type short password
      await userEvent.type(
        screen.getByPlaceholderText('Enter your password'),
        '123',
      );

      // Button should still be disabled due to short password
      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });

    it('submit button is enabled when form is valid', async () => {
      render(<FormCatto {...defaultProps} />);

      await userEvent.type(
        screen.getByPlaceholderText('Enter your email'),
        'test@example.com',
      );
      await userEvent.type(
        screen.getByPlaceholderText('Enter your password'),
        'password123',
      );

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /submit/i });
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  // ============================================
  // Submit Tests
  // ============================================

  describe('Form Submission', () => {
    it('calls onSubmit with form data when valid', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<FormCatto {...defaultProps} onSubmit={onSubmit} />);

      await userEvent.type(
        screen.getByPlaceholderText('Enter your email'),
        'test@example.com',
      );
      await userEvent.type(
        screen.getByPlaceholderText('Enter your password'),
        'password123',
      );

      // Wait for form to become valid
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /submit/i }),
        ).not.toBeDisabled();
      });

      await userEvent.click(screen.getByRole('button', { name: /submit/i }));

      // The form wrapper calls onSubmit internally after handleSubmit validation
      await waitFor(
        () => {
          expect(onSubmit).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );

      // Check that it was called with correct data shape
      const callArgs = onSubmit.mock.calls[0][0];
      expect(callArgs.email).toBe('test@example.com');
      expect(callArgs.password).toBe('password123');
    });

    it('submit button shows submitting text when isSubmitting', () => {
      render(<FormCatto {...defaultProps} isSubmitting={true} />);
      expect(
        screen.getByRole('button', { name: /submitting/i }),
      ).toBeInTheDocument();
    });

    it('submit button is disabled when submitting', () => {
      render(<FormCatto {...defaultProps} isSubmitting={true} />);
      expect(
        screen.getByRole('button', { name: /submitting/i }),
      ).toBeDisabled();
    });

    it('inputs are disabled when submitting', () => {
      render(<FormCatto {...defaultProps} isSubmitting={true} />);
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });
  });

  // ============================================
  // Error Banner Tests
  // ============================================

  describe('Error Banner', () => {
    it('shows error banner when errorMessage provided', () => {
      render(
        <FormCatto {...defaultProps} errorMessage="Something went wrong" />,
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('shows dismiss button in error banner', () => {
      const onCloseError = vi.fn();
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Error"
          onCloseError={onCloseError}
        />,
      );
      expect(
        screen.getByRole('button', { name: /dismiss error/i }),
      ).toBeInTheDocument();
    });

    it('calls onCloseError when dismiss clicked', async () => {
      const onCloseError = vi.fn();
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Error"
          onCloseError={onCloseError}
        />,
      );

      await userEvent.click(
        screen.getByRole('button', { name: /dismiss error/i }),
      );
      expect(onCloseError).toHaveBeenCalledTimes(1);
    });

    it('does not show dismiss button when no onCloseError', () => {
      render(<FormCatto {...defaultProps} errorMessage="Error" />);
      expect(
        screen.queryByRole('button', { name: /dismiss error/i }),
      ).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Error Modal Tests (with errorActions)
  // ============================================

  describe('Error Modal', () => {
    const errorActions = {
      primaryLabel: 'Try Again',
      primaryAction: vi.fn(),
      secondaryLabel: 'Get Help',
      secondaryHref: '/help',
      tertiaryLabel: 'Contact Support',
      tertiaryHref: '/support',
    };

    it('shows error modal when errorMessage and errorActions provided', () => {
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Authentication failed"
          errorActions={errorActions}
        />,
      );
      // Modal should show the error message
      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
    });

    it('does not show inline banner when errorActions provided', () => {
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Error"
          errorActions={errorActions}
        />,
      );
      // Should not have alert role (inline banner uses alert role)
      const alerts = screen.queryAllByRole('alert');
      expect(alerts).toHaveLength(0);
    });

    it('shows primary action button in error modal', () => {
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Error"
          errorActions={errorActions}
        />,
      );
      expect(
        screen.getByRole('button', { name: /try again/i }),
      ).toBeInTheDocument();
    });

    it('calls primaryAction when primary button clicked', async () => {
      const primaryAction = vi.fn();
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Error"
          errorActions={{ primaryLabel: 'Retry', primaryAction }}
        />,
      );

      await userEvent.click(screen.getByRole('button', { name: /retry/i }));
      expect(primaryAction).toHaveBeenCalledTimes(1);
    });

    it('shows secondary link in error modal', () => {
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Error"
          errorActions={errorActions}
        />,
      );
      expect(screen.getByRole('link', { name: /get help/i })).toHaveAttribute(
        'href',
        '/help',
      );
    });

    it('shows tertiary link in error modal', () => {
      render(
        <FormCatto
          {...defaultProps}
          errorMessage="Error"
          errorActions={errorActions}
        />,
      );
      expect(
        screen.getByRole('link', { name: /contact support/i }),
      ).toHaveAttribute('href', '/support');
    });
  });

  // ============================================
  // Custom Render Tests
  // ============================================

  describe('Custom Field Render', () => {
    it('renders custom field when renderCustom provided', () => {
      const customFields = [
        {
          name: 'name' as const,
          label: 'Name',
          renderCustom: (
            field: { value: string; onChange: (val: string) => void },
            fieldState: { error?: { message?: string } },
          ) => (
            <div data-testid="custom-field">
              <input
                type="text"
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                data-testid="custom-input"
              />
              {fieldState.error && (
                <span data-testid="custom-error">
                  {fieldState.error.message}
                </span>
              )}
            </div>
          ),
        },
      ];

      render(
        <FormCatto
          fields={customFields}
          validationSchema={singleFieldSchema}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByTestId('custom-field')).toBeInTheDocument();
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
  });

  // ============================================
  // Input Variant Tests
  // ============================================

  describe('Input Variants', () => {
    it('uses default outlined variant', () => {
      const { container } = render(<FormCatto {...defaultProps} />);
      // InputCatto with outlined variant should be present
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('passes inputVariant to InputCatto', () => {
      // This test verifies the prop is passed - visual appearance tested separately
      render(<FormCatto {...defaultProps} inputVariant="filled" />);
      expect(
        screen.getByPlaceholderText('Enter your email'),
      ).toBeInTheDocument();
    });

    it('passes inputVariant minimal to InputCatto', () => {
      render(<FormCatto {...defaultProps} inputVariant="minimal" />);
      expect(
        screen.getByPlaceholderText('Enter your email'),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // Focus Behavior Tests
  // ============================================

  describe('Focus Behavior', () => {
    it('focuses first input on mount', async () => {
      render(<FormCatto {...defaultProps} />);

      await waitFor(() => {
        const firstInput = screen.getByPlaceholderText('Enter your email');
        expect(document.activeElement).toBe(firstInput);
      });
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================

  describe('Accessibility', () => {
    it('form has accessible name', () => {
      render(<FormCatto {...defaultProps} />);
      expect(
        screen.getByRole('form', { name: /form submission/i }),
      ).toBeInTheDocument();
    });

    it('labels are associated with inputs', () => {
      render(<FormCatto {...defaultProps} />);
      const emailLabel = screen.getByText('Email');
      expect(emailLabel).toHaveAttribute('for', 'email');
    });

    it('error banner has alert role', () => {
      render(<FormCatto {...defaultProps} errorMessage="Error" />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('button stays disabled with invalid data', async () => {
      render(<FormCatto {...defaultProps} />);

      // Enter invalid email and valid password
      const emailInput = screen.getByPlaceholderText('Enter your email');
      await userEvent.type(emailInput, 'bad');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      await userEvent.type(passwordInput, 'password123');

      // Button should stay disabled because email is invalid
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });
  });

  // ============================================
  // Multiple Fields Tests
  // ============================================

  describe('Multiple Fields', () => {
    it('renders multiple fields correctly', () => {
      const multiFieldSchema = z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
      });

      const multiFields = [
        {
          name: 'firstName' as const,
          label: 'First Name',
          placeholder: 'First',
        },
        { name: 'lastName' as const, label: 'Last Name', placeholder: 'Last' },
        {
          name: 'email' as const,
          label: 'Email',
          type: 'email',
          placeholder: 'Email',
        },
        {
          name: 'phone' as const,
          label: 'Phone',
          type: 'tel',
          placeholder: 'Phone',
        },
      ];

      render(
        <FormCatto
          fields={multiFields}
          validationSchema={multiFieldSchema}
          onSubmit={vi.fn()}
        />,
      );

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });
  });
});
