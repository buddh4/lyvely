import type { IContentSearchResult } from './content-search-result.interface';

export type ContentPickerHandler = (search: string) => Promise<IContentSearchResult>;
