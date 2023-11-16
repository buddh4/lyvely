export type ITranslatable =
  | string
  | ((options?: Record<string, string>) => string)
  | (() => string)
  | { plain: string }
  | {
      key: string;
      params?: Record<string, any>;
    };
