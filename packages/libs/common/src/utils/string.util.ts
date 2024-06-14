import { encode, decode, escape, unescape } from 'he';

export function encodeHtml(str: string) {
  return encode(str);
}

export function decodeHtml(str: string) {
  return decode(str);
}

export function escapeHtml(str: string) {
  return escape(str);
}

export function escapeHtmlIf(str: string, condition: boolean) {
  return condition ? escape(str) : str;
}

export function unEscapeHtml(str: string) {
  return unescape(str);
}
