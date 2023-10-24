export type TranslationAdapter = (text: Translatable) => string;

export type Translatable = string | (() => string) | { plain: string };

let translationAdapter: TranslationAdapter;

export function setTranslationProvider(adapter: TranslationAdapter) {
  translationAdapter = adapter;
}

export function t(text?: Translatable): string {
  if (!text || (typeof text === 'string' && !text.length)) return '';
  if (translationAdapter) return translationAdapter(text);
  if (typeof text === 'object') return text.plain;
  if (typeof text === 'function') return text();
  if (typeof text === 'string') return text;

  return '';
}
