/**
 * Explanation:
 *     ^[^\W_]: Start with a letter or number (but not an underscore).
 *     (?:(?!__)[\p{L}\p{N}\p{Pd}_]): Match any letter, number, underscore, or hyphen, but do not allow two consecutive underscores.
 *         [\p{L}\p{N}\p{Pd}_]: Match letters, numbers, underscores, or hyphens.
 *         (?:__|--): Negative lookahead to ensure not two underscores or hyphens in a row.
 *     {2,29}: Ensure the total length is between 3 and 30 characters (adjust as needed).
 *     [^\W_]$: End with a letter or number (but not an underscore).
 *     The u flag enables full Unicode matching.
 */
export const VALID_DISPLAY_NAME_REGEX = /^[^\W_](?:(?!(?:__|--))[\p{L}\p{N}\p{Pd}_]){2,29}[^\W_]$/u;

/**
 * Regular Expression Explanation:
 *
 * This regular expression defines the format for usernames that are compatible for use within URLs.
 *
 * Explanation of Components:
 * - ^[^\W_]: Ensures that the username starts with a character that is not a non-word character (\W) or an underscore (_).
 * - (?:(?!(__|--|-_|_-))[a-zA-Z0-9_-]): Matches the middle part of the username, allowing letters (uppercase and lowercase), digits, hyphens (-), and underscores (_).
 *    - (?!(__|--|-_|_-)): This part uses negative lookahead to disallow consecutive underscores, consecutive hyphens, combinations of hyphen and underscore, or underscore followed by hyphen.
 * - {2,29}: Enforces a minimum length of 3 characters and a maximum length of 30 characters for the entire username.
 * - [^\W_]: Ensures that the username ends with a character that is not a non-word character (\W) or an underscore (_).
 *
 * Username Constraints:
 * - Allowed characters include letters (uppercase and lowercase), digits, hyphens (-), and underscores (_).
 * - Consecutive underscores, consecutive hyphens, combinations of hyphen and underscore, or underscore followed by hyphen are not allowed.
 * - Minimum length of 3 characters and a maximum length of 30 characters for usernames.
 *
 * These usernames should be compatible for use within URLs while maintaining a reasonable format.
 */
export const VALID_HANDLE_REGEX = /^[^\W_](?:(?!(__|--|-_|_-))[a-zA-Z0-9_-]){2,29}[^\W_]$/;

export const MIN_HANDLE_LENGTH = 3;
export const MAX_HANDLE_LENGTH = 29;
