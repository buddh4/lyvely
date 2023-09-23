export declare const REGEX_HEX_COLOR: RegExp;
export declare function applyValidationProperties<T>(model: T, data: {
    [key in keyof T]?: any;
}, level?: number, { maxDepth }?: {
    maxDepth?: number | undefined;
}): T;
export declare function getValidationFields<T>(model: T): Set<unknown>;
export declare function isValidEmail(email: string): boolean;
export declare function isGuid(guid: string): boolean;
export declare const escapeHTML: (str: string) => string | undefined;
