// @catto/react-contact — TypeScript types

import type { UseFormReturn } from 'react-hook-form';

/** Field names supported by the contact form */
export type ContactFieldName =
  | 'senderName'
  | 'senderEmail'
  | 'senderPhone'
  | 'subject'
  | 'message';

/** Per-field configuration for the contact schema */
export interface ContactFieldConfig {
  /** Whether this field is included in the schema (default: true) */
  enabled?: boolean;
  /** Whether this field is required (default: varies by field) */
  required?: boolean;
  /** Minimum length constraint */
  minLength?: number;
  /** Maximum length constraint */
  maxLength?: number;
  /** Whether to run profanity check on this field (default: false) */
  profanityCheck?: boolean;
  /** Custom validation error messages */
  messages?: {
    min?: string;
    max?: string;
    required?: string;
    invalid?: string;
    profanity?: string;
  };
}

/** Configuration for createContactSchema() */
export interface ContactSchemaConfig {
  /** Per-field overrides (unspecified fields use defaults) */
  fields?: Partial<Record<ContactFieldName, ContactFieldConfig>>;
  /**
   * Profanity checker function — returns true if text IS profane.
   * If not provided, profanityCheck flags on fields are silently ignored.
   */
  profanityChecker?: (text: string) => boolean;
  /** Custom profanity error message factory (receives field name) */
  profanityMessage?: (fieldName: string) => string;
}

/** Shape of the contact form data */
export interface ContactFormData {
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  subject: string;
  message: string;
}

/** Configuration for useContactForm() */
export interface UseContactFormConfig {
  /** Schema configuration for Zod validation */
  schema?: ContactSchemaConfig;
  /** Called on successful form submission with cleaned data and optional reCAPTCHA token */
  onSubmit: (data: ContactFormData, recaptchaToken?: string) => Promise<void>;
  /** reCAPTCHA v3 site key — omit to disable reCAPTCHA entirely */
  recaptchaSiteKey?: string;
  /** Default form values */
  defaultValues?: Partial<ContactFormData>;
}

/** Return value of useContactForm() */
export interface UseContactFormReturn {
  /** RHF register function */
  register: UseFormReturn<ContactFormData>['register'];
  /** Wrapped handleSubmit — call as onSubmit handler */
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  /** Field validation errors */
  errors: UseFormReturn<ContactFormData>['formState']['errors'];
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Whether the form was submitted successfully */
  isSuccess: boolean;
  /** Top-level form error message (from onSubmit rejection) */
  formError: string;
  /** Reset form to initial state */
  reset: () => void;
  /** Whether reCAPTCHA is loaded and ready */
  recaptchaReady: boolean;
  /** The underlying RHF form instance (for advanced use) */
  form: UseFormReturn<ContactFormData>;
}

/** Configuration for useRecaptcha() */
export interface UseRecaptchaConfig {
  /** reCAPTCHA v3 site key — omit or pass undefined to disable */
  siteKey?: string;
  /** reCAPTCHA action name (default: 'contact_form') */
  action?: string;
}

/** Return value of useRecaptcha() */
export interface UseRecaptchaReturn {
  /** Whether the reCAPTCHA script is loaded */
  ready: boolean;
  /** Execute reCAPTCHA and get a token (returns undefined on failure or when disabled) */
  executeRecaptcha: () => Promise<string | undefined>;
}
