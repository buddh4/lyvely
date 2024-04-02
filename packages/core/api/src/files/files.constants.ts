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
