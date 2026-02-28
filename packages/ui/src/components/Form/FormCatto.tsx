// @catto/ui - FormCatto
// Reusable form component built on react-hook-form with Zod validation
'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import {
  Controller,
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, X } from 'lucide-react';
import { z } from 'zod';
import { cn } from '../../utils';
import ButtonCatto from '../Button/ButtonCatto';
import InputCatto from '../Input/InputCatto';
import LinkCatto from '../Link/LinkCatto';
import LoadingMessageAndCircleCatto from '../Loading/LoadingMessageAndCircleCatto';
import MellowModalCatto from '../Modal/MellowModalCatto';

/** Error action buttons configuration */
export interface FormErrorActions {
  /** Primary action button label */
  primaryLabel?: string;
  /** Primary action button callback */
  primaryAction?: () => void;
  /** Secondary link button label */
  secondaryLabel?: string;
  /** Secondary link href */
  secondaryHref?: string;
  /** Tertiary link label */
  tertiaryLabel?: string;
  /** Tertiary link href */
  tertiaryHref?: string;
}

/** Customizable labels for the form */
export interface FormCattoLabels {
  /** Submit button text (default: "Submit") */
  submit?: string;
  /** Submitting state text (default: "Submitting...") */
  submitting?: string;
  /** Cancel button text (default: "Cancel") */
  cancel?: string;
  /** Error modal title (default: "Error") */
  error?: string;
}

/** Default labels */
const DEFAULT_LABELS: Required<FormCattoLabels> = {
  submit: 'Submit',
  submitting: 'Submitting...',
  cancel: 'Cancel',
  error: 'Error',
};

/** Field configuration for the form */
export interface FormField<T extends FieldValues> {
  /** Field name (must match schema) */
  name: Path<T>;
  /** Field label displayed above input */
  label: string;
  /** HTML input type (default: "text") */
  type?: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Default value for the field */
  defaultValue?: T[keyof T];
  /** Custom render function for complex inputs */
  renderCustom?: (
    field: {
      onChange: (value: T[keyof T]) => void;
      onBlur: () => void;
      value: T[keyof T];
      ref: React.Ref<HTMLInputElement | HTMLSelectElement>;
    },
    fieldState: { error?: { message?: string } },
  ) => JSX.Element;
}

export interface FormCattoProps<T extends FieldValues> {
  /** Array of field configurations */
  fields: FormField<T>[];
  /** Submit handler callback */
  onSubmit: SubmitHandler<T>;
  /** Zod validation schema */
  validationSchema: z.ZodSchema<T>;
  /** Custom submit button text (overrides labels.submit) */
  submitText?: string | React.ReactNode;
  /** Error message to display */
  errorMessage?: string;
  /** Whether form is currently submitting */
  isSubmitting?: boolean;
  /** Callback when error is dismissed */
  onCloseError?: () => void;
  /** Show cancel button alongside submit */
  showCancelButton?: boolean;
  /** Cancel button callback */
  onCancel?: () => void;
  /** Error modal action buttons */
  errorActions?: FormErrorActions;
  /** Custom labels for form text */
  labels?: FormCattoLabels;
  /** Additional CSS classes for the form container */
  className?: string;
  /** Input variant style */
  inputVariant?: 'outlined' | 'filled' | 'minimal';
  /** Content rendered inside the form container, before the fields */
  headerContent?: React.ReactNode;
}

/**
 * Reusable form component with react-hook-form and Zod validation
 *
 * @example
 * const schema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * });
 *
 * <FormCatto
 *   fields={[
 *     { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
 *     { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password' },
 *   ]}
 *   validationSchema={schema}
 *   onSubmit={(data) => console.log(data)}
 * />
 */
const FormCatto = <T extends FieldValues>({
  fields,
  onSubmit,
  validationSchema,
  submitText,
  errorMessage,
  isSubmitting = false,
  onCloseError,
  showCancelButton = false,
  onCancel,
  errorActions,
  labels = {},
  className,
  inputVariant = 'outlined',
  headerContent,
}: FormCattoProps<T>) => {
  // Merge with default labels
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };
  const defaultSubmitText = submitText ?? mergedLabels.submit;

  // Initialize react-hook-form with Zod schema resolver
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zodResolverTyped = zodResolver as any;
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm<T>({
    resolver: zodResolverTyped(validationSchema),
    defaultValues: fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.defaultValue ?? '',
      }),
      {},
    ) as DefaultValues<T>,
  });

  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const handleClick = async () => {
    setShowLoadingModal(true);
    try {
      // Type assertion needed for cross-version react-hook-form compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (handleSubmit as any)(async (formData: T) => {
        await onSubmit(formData);
        reset();
      })();
    } catch (_error) {
      // Error handling is done via errorMessage prop
    } finally {
      setShowLoadingModal(false);
    }
  };

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  return (
    <div className={cn('flex w-full justify-center', className)}>
      <div className="w-full rounded-2xl bg-gray-300 p-2 dark:bg-gray-600">
        <form
          className="w-full"
          // Type assertion needed for cross-version react-hook-form compatibility
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={(handleSubmit as any)(onSubmit)}
          aria-label="Form submission"
        >
          {/* Header content rendered before fields */}
          {headerContent && <div className="mb-4 w-full">{headerContent}</div>}

          {/* Inline Error Banner - shown when errorMessage exists but no errorActions */}
          {errorMessage && !errorActions && (
            <div
              className="mb-4 flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
              {onCloseError && (
                <button
                  type="button"
                  onClick={onCloseError}
                  className="rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-800/50"
                  aria-label="Dismiss error"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {fields.map((field, index) => (
            <div
              className="w-full"
              key={field.name}
              style={{ marginBottom: '1rem' }}
            >
              <div className="mb-2">
                <label
                  className="m-4 font-light text-slate-900 dark:text-gray-100"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
              </div>
              {/* Use Controller to manage input field state and validation */}
              <Controller
                name={field.name}
                control={control}
                defaultValue={field.defaultValue}
                render={({ field: controllerField, fieldState: { error } }) =>
                  field.renderCustom ? (
                    field.renderCustom(controllerField, { error })
                  ) : (
                    <>
                      <InputCatto
                        id={field.name}
                        type={field.type || 'text'}
                        placeholder={field.placeholder || ''}
                        ref={index === 0 ? firstInputRef : null}
                        value={controllerField.value}
                        onChange={(value, event) => {
                          controllerField.onChange(event);
                        }}
                        onBlur={controllerField.onBlur}
                        disabled={isSubmitting}
                        variant={inputVariant}
                        size="medium"
                        className="mt-2 ps-10"
                      />
                      {errors[field.name] && (
                        <span className="text-red-800 dark:text-red-500">
                          {errors[field.name]?.message as string}
                        </span>
                      )}
                    </>
                  )
                }
              />
            </div>
          ))}

          <div className="mb-2 flex h-full w-full gap-4 items-center justify-center">
            {/* order-2 so tab order is submit first but visually on right side */}
            <div className="w-full sm:w-2/3 order-2">
              <ButtonCatto
                label={
                  isSubmitting ? mergedLabels.submitting : defaultSubmitText
                }
                onClick={handleClick}
                disabled={isSubmitting || !isValid}
              />
            </div>
            {showCancelButton && (
              <div className="w-full sm:w-2/3 order-1">
                <ButtonCatto
                  label={mergedLabels.cancel}
                  onClick={onCancel}
                  disabled={isSubmitting}
                  variant="tertiary"
                />
              </div>
            )}
          </div>
        </form>

        {/* Loading Modal */}
        <MellowModalCatto
          isOpen={showLoadingModal}
          onClose={() => setShowLoadingModal(false)}
          title={mergedLabels.submitting}
          theme="midnightEmber"
          size="sm"
          position="center"
          closeOnEscape={false}
          closeOnOutsideClick={false}
          preventScroll={true}
        >
          <LoadingMessageAndCircleCatto />
        </MellowModalCatto>

        {/* Error Modal - shown when errorActions are provided */}
        <MellowModalCatto
          isOpen={Boolean(errorMessage && errorActions)}
          onClose={() => onCloseError?.()}
          title={mergedLabels.error}
          theme="danger"
          size="md"
          icon={AlertCircle}
          position="top"
          closeOnEscape={true}
          closeOnOutsideClick={true}
          preventScroll={true}
          footer={
            errorActions ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {errorActions.primaryLabel && (
                    <ButtonCatto
                      variant="primary"
                      size="small"
                      onClick={() => {
                        errorActions.primaryAction?.();
                        onCloseError?.();
                      }}
                    >
                      {errorActions.primaryLabel}
                    </ButtonCatto>
                  )}
                  {errorActions.secondaryLabel &&
                    errorActions.secondaryHref && (
                      <LinkCatto
                        href={errorActions.secondaryHref}
                        variant="button"
                        size="sm"
                      >
                        {errorActions.secondaryLabel}
                      </LinkCatto>
                    )}
                </div>
                {errorActions.tertiaryLabel && errorActions.tertiaryHref && (
                  <div className="text-center">
                    <LinkCatto
                      href={errorActions.tertiaryHref}
                      variant="underline"
                      size="sm"
                    >
                      {errorActions.tertiaryLabel}
                    </LinkCatto>
                  </div>
                )}
              </div>
            ) : undefined
          }
        >
          <p>{errorMessage}</p>
        </MellowModalCatto>
      </div>
    </div>
  );
};

export default FormCatto;
