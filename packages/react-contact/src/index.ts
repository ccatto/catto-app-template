// @catto/react-contact - React hooks and schema factory for contact forms

// Logger
export { configureContactLogger, getLogger } from './logger';
export type { CattoContactLogger } from './logger';

// Schema
export { createContactSchema } from './schema/contactSchema';

// Hooks
export { useContactForm } from './hooks/useContactForm';
export { useRecaptcha } from './hooks/useRecaptcha';

// Types
export type {
  ContactFieldConfig,
  ContactFieldName,
  ContactFormData,
  ContactSchemaConfig,
  UseContactFormConfig,
  UseContactFormReturn,
  UseRecaptchaConfig,
  UseRecaptchaReturn,
} from './types';
