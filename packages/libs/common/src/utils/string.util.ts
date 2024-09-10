import { encode, decode, escape, unescape } from 'he';

/**
 * Encodes a given string as HTML entities.
 *
 * @param {string} str - The string to be encoded.
 * @return {string} - The encoded string.
 */
export function encodeHtml(str: string) {
  return encode(str);
}

/**
 * Decodes HTML entities in a given string.
 *
 * @param {string} str - The string to decode HTML entities.
 * @return {string} - The decoded string without HTML entities.
 */
export function decodeHtml(str: string) {
  return decode(str);
}

/**
 * Escapes special characters in an HTML string.
 *
 * @param {string} str - The string to escape.
 * @return {string} - The escaped HTML string.
 */
export function escapeHtml(str: string) {
  return escape(str);
}

/**
 * Escapes the HTML special characters in a string if a condition is met.
 *
 * @param {string} str - The string to escape.
 * @param {boolean} condition - The condition to check. If true, the HTML special characters in the string will be escaped.
 *
 * @return {string} - The escaped string if the condition is met, otherwise, the same string is returned.
 */
export function escapeHtmlIf(str: string, condition: boolean) {
  return condition ? escape(str) : str;
}

/**
 * Removes HTML entities from a given string and returns the result.
 *
 * @param {string} str - The string containing HTML entities to be removed.
 * @return {string} - The resulting string with HTML entities removed.
 */
export function unEscapeHtml(str: string) {
  return unescape(str);
}

/**
 * Truncates a string if it exceeds the maximum length.
 *
 * @param {string} value - The string to be truncated.
 * @param {number} max - The maximum length of the string.
 * @returns {string} - The truncated string, with an ellipsis appended if necessary.
 */
export function truncate(value: string, max: number) {
  if (value.length > max) {
    return value.slice(0, max) + '...';
  }
  return value;
}
