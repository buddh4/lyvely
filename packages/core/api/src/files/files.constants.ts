import type { ImageMime } from '@/files/interfaces/image-mime.types';

/**
 * Note a storage bucket consists usually of lowercase characters and hyphens e.g. 'avatars'.
 *
 * Used to validate bucket names:
 *
 * [a-zA-Z0-9]: Start with a lowercase or uppercase letter or a digit.
 *
 * [a-zA-Z0-9-]{1,61}: Allow only lowercase or uppercase and digits and hyphens.
 *
 * [a-zA-Z0-9]$: End with lowercase or uppercase or digit.
 * */
export const REGEX_STORAGE_BUCKET = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;

/**
 * Defines the local storage bucket for uploads.
 */
export const STORAGE_BUCKET_UPLOADS = 'tmp';

/**
 * Supported image mime types
 */
export const IMAGE_MIME_TYPES: ImageMime[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/tiff',
] as const;
