// @catto/react-contact — Zod schema factory

import { z } from 'zod';
import type {
  ContactFieldConfig,
  ContactFieldName,
  ContactFormData,
  ContactSchemaConfig,
} from '../types';

/** Default field configurations matching RLeaguez contact form */
const FIELD_DEFAULTS: Record<
  ContactFieldName,
  Required<
    Pick<
      ContactFieldConfig,
      'enabled' | 'required' | 'minLength' | 'maxLength' | 'profanityCheck'
    >
  >
> = {
  senderName: {
    enabled: true,
    required: true,
    minLength: 2,
    maxLength: 255,
    profanityCheck: true,
  },
  senderEmail: {
    enabled: true,
    required: false,
    minLength: 0,
    maxLength: 255,
    profanityCheck: false,
  },
  senderPhone: {
    enabled: true,
    required: false,
    minLength: 0,
    maxLength: 50,
    profanityCheck: false,
  },
  subject: {
    enabled: true,
    required: true,
    minLength: 3,
    maxLength: 255,
    profanityCheck: true,
  },
  message: {
    enabled: true,
    required: true,
    minLength: 10,
    maxLength: 5000,
    profanityCheck: true,
  },
};

const PHONE_REGEX = /^[+]?[\d\s\-().]*$/;

/**
 * Create a Zod schema for contact form validation.
 *
 * @param config - Optional configuration to override defaults
 * @returns A Zod schema that validates ContactFormData
 */
export function createContactSchema(
  config: ContactSchemaConfig = {},
): z.ZodType<ContactFormData> {
  const { fields = {}, profanityChecker, profanityMessage } = config;

  const getField = (
    name: ContactFieldName,
  ): Required<
    Pick<
      ContactFieldConfig,
      'enabled' | 'required' | 'minLength' | 'maxLength' | 'profanityCheck'
    >
  > & { messages?: ContactFieldConfig['messages'] } => ({
    ...FIELD_DEFAULTS[name],
    ...fields[name],
    messages: fields[name]?.messages,
  });

  const addProfanity = (
    schema: z.ZodString,
    fieldName: string,
    fieldConfig: ReturnType<typeof getField>,
  ): z.ZodEffects<z.ZodString, string, string> | z.ZodString => {
    if (!fieldConfig.profanityCheck || !profanityChecker) return schema;
    const msg =
      fieldConfig.messages?.profanity ??
      (profanityMessage
        ? profanityMessage(fieldName)
        : `${fieldName} contains inappropriate language`);
    return schema.refine((val) => !profanityChecker(val), { message: msg });
  };

  // Build shape dynamically
  const shape: Record<string, z.ZodTypeAny> = {};

  // senderName
  const nameConfig = getField('senderName');
  if (nameConfig.enabled) {
    let nameSchema = z
      .string()
      .min(nameConfig.minLength, { message: nameConfig.messages?.min })
      .max(nameConfig.maxLength, { message: nameConfig.messages?.max });
    shape.senderName = addProfanity(nameSchema, 'Name', nameConfig);
  }

  // senderEmail
  const emailConfig = getField('senderEmail');
  if (emailConfig.enabled) {
    const emailBase = z
      .string()
      .email({ message: emailConfig.messages?.invalid })
      .max(emailConfig.maxLength, { message: emailConfig.messages?.max });

    if (emailConfig.required) {
      shape.senderEmail = emailBase;
    } else {
      shape.senderEmail = emailBase.optional().or(z.literal(''));
    }
  }

  // senderPhone
  const phoneConfig = getField('senderPhone');
  if (phoneConfig.enabled) {
    const phoneBase = z
      .string()
      .max(phoneConfig.maxLength, { message: phoneConfig.messages?.max })
      .regex(PHONE_REGEX, {
        message: phoneConfig.messages?.invalid ?? 'Invalid phone number format',
      });

    if (phoneConfig.required) {
      shape.senderPhone = phoneBase;
    } else {
      shape.senderPhone = phoneBase.optional().or(z.literal(''));
    }
  }

  // subject
  const subjectConfig = getField('subject');
  if (subjectConfig.enabled) {
    let subjectSchema = z
      .string()
      .min(subjectConfig.minLength, { message: subjectConfig.messages?.min })
      .max(subjectConfig.maxLength, { message: subjectConfig.messages?.max });
    shape.subject = addProfanity(subjectSchema, 'Subject', subjectConfig);
  }

  // message
  const messageConfig = getField('message');
  if (messageConfig.enabled) {
    let messageSchema = z
      .string()
      .min(messageConfig.minLength, { message: messageConfig.messages?.min })
      .max(messageConfig.maxLength, { message: messageConfig.messages?.max });
    shape.message = addProfanity(messageSchema, 'Message', messageConfig);
  }

  return z.object(shape) as unknown as z.ZodType<ContactFormData>;
}
