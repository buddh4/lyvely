import * as he from 'he';
export function encodeHtml(str) {
    return he.encode(str);
}
export function decodeHtml(str) {
    return he.decode(str);
}
export function escapeHtml(str) {
    return he.escape(str);
}
export function escapeHtmlIf(str, condition) {
    return condition ? he.escape(str) : str;
}
export function unEscapeHtml(str) {
    return he.unescape(str);
}
