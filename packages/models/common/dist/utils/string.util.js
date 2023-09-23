"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unEscapeHtml = exports.escapeHtmlIf = exports.escapeHtml = exports.decodeHtml = exports.encodeHtml = void 0;
const he = require("he");
function encodeHtml(str) {
    return he.encode(str);
}
exports.encodeHtml = encodeHtml;
function decodeHtml(str) {
    return he.decode(str);
}
exports.decodeHtml = decodeHtml;
function escapeHtml(str) {
    return he.escape(str);
}
exports.escapeHtml = escapeHtml;
function escapeHtmlIf(str, condition) {
    return condition ? he.escape(str) : str;
}
exports.escapeHtmlIf = escapeHtmlIf;
function unEscapeHtml(str) {
    return he.unescape(str);
}
exports.unEscapeHtml = unEscapeHtml;
