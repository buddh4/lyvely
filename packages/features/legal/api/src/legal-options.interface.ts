import type { ModuleConfig } from '@lyvely/api';

export interface ILegalOptions {
  poweredBy?: boolean;
  sections: {
    [k: string]: {
      label: string;
      content?: string;
      url?: string;
      version: string;
      format?: 'html' | 'markdown';
      locales?: {
        [k: string]: {
          label: string;
          content?: string;
          url?: string;
          version: string;
          format?: 'html' | 'markdown';
        };
      };
    };
  };
}

export type LegalConfig = ModuleConfig<'legal', ILegalOptions>;
