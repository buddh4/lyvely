import type { IContentInfo } from './content-info.interface';

export type IContentPickerProvider = (search: string) => Promise<IContentInfo[]>;
