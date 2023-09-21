export type TranslationAdapter = (text:string) => string;

let translationAdapter: TranslationAdapter;

export function setTranslationProvider(adapter: TranslationAdapter) {
    translationAdapter = adapter;
}

export function t(text: string) {
    return translationAdapter ? translationAdapter(text) : text;
}