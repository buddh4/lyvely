export type Translatable =
  | {
      key: string;
      params?: Record<string, any>;
    }
  | string;
