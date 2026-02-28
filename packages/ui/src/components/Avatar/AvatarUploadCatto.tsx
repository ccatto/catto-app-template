// @catto/ui - AvatarUploadCatto Component
// Reusable avatar upload UI with file picker, preview, validation, and upload delegation
'use client';

import { useRef, useState } from 'react';
import AvatarCatto, { type AvatarSize } from './AvatarCatto';

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const DEFAULT_LABELS = {
  changePhoto: 'Change photo',
  addPhoto: 'Add photo',
  uploading: 'Uploading...',
  invalidType: 'Please select a JPEG, PNG, or WebP image',
  tooLarge: 'Image must be under 5MB',
  uploadFailed: 'Upload failed. Please try again.',
};

export interface AvatarUploadCattoLabels {
  changePhoto?: string;
  addPhoto?: string;
  uploading?: string;
  invalidType?: string;
  tooLarge?: string;
  uploadFailed?: string;
}

export interface AvatarUploadCattoProps {
  /** Current image URL */
  src?: string | null;
  /** User name (for AvatarCatto initials fallback) */
  name?: string;
  /** Avatar size (passed to AvatarCatto) */
  size?: AvatarSize;
  /** Whether upload is enabled */
  editable?: boolean;
  /** Upload handler — receives the File, should return the CDN URL */
  onUpload?: (file: File) => Promise<string>;
  /** Max file size in bytes (default: 5MB) */
  maxFileSize?: number;
  /** Allowed MIME types (default: jpeg, png, webp) */
  allowedTypes?: string[];
  /** Labels for i18n (defaults to English) */
  labels?: AvatarUploadCattoLabels;
  /** Additional CSS classes */
  className?: string;
}

/**
 * AvatarUploadCatto - Avatar display with upload capability
 *
 * Handles file picking, client-side validation, local preview, and upload delegation.
 * The actual upload logic is provided by the consumer via `onUpload`.
 *
 * @example
 * // With upload handler
 * <AvatarUploadCatto
 *   src={user.avatarUrl}
 *   name={user.name}
 *   editable
 *   onUpload={async (file) => {
 *     const url = await uploadToServer(file);
 *     return url;
 *   }}
 * />
 *
 * @example
 * // Display-only (no upload)
 * <AvatarUploadCatto src={user.avatarUrl} name={user.name} />
 */
export default function AvatarUploadCatto({
  src,
  name,
  size = '2xl',
  editable = false,
  onUpload,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  labels: userLabels,
  className = '',
}: AvatarUploadCattoProps) {
  const labels = { ...DEFAULT_LABELS, ...userLabels };
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayUrl = previewUrl || src || undefined;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(labels.invalidType);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError(labels.tooLarge);
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      if (onUpload) {
        const cdnUrl = await onUpload(file);
        setPreviewUrl(cdnUrl);
      }
    } catch (_err) {
      setError(labels.uploadFailed);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar display */}
      <div
        className={
          editable
            ? 'group relative cursor-pointer transition-transform active:scale-95'
            : 'relative'
        }
        onClick={triggerFileInput}
      >
        <AvatarCatto
          src={displayUrl}
          name={name}
          size={size}
          alt={name || 'Profile'}
        />

        {/* Desktop: subtle full overlay on hover */}
        {editable && !isUploading && (
          <div className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/30 sm:flex">
            <svg
              className="h-6 w-6 text-slate-50 opacity-0 transition-opacity group-hover:opacity-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
              />
            </svg>
          </div>
        )}

        {/* Always-visible camera badge (bottom-right corner) */}
        {editable && !isUploading && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-50 bg-orange-500 shadow-md dark:border-gray-800">
            <svg
              className="h-3.5 w-3.5 text-slate-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
              />
            </svg>
          </div>
        )}

        {/* Upload spinner overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
            <svg
              className="h-8 w-8 animate-spin text-slate-50"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedTypes.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      {/* Upload label */}
      {editable && !isUploading && (
        <button
          type="button"
          onClick={triggerFileInput}
          className="mt-2 block w-full text-center text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
        >
          {displayUrl ? labels.changePhoto : labels.addPhoto}
        </button>
      )}

      {/* Uploading label */}
      {isUploading && (
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {labels.uploading}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-center text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
