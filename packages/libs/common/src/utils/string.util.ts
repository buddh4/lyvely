import he from 'he';

export function encodeHtml(str: string) {
  return he.encode(str);
}

export function decodeHtml(str: string) {
  return he.decode(str);
}

export function escapeHtml(str: string) {
  return he.escape(str);
}

export function escapeHtmlIf(str: string, condition: boolean) {
  return condition ? he.escape(str) : str;
}

export function unEscapeHtml(str: string) {
  return he.unescape(str);
}
