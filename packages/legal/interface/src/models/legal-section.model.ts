import { BaseModel } from '@lyvely/common';
import { Expose } from 'class-transformer';

export interface ILegalSection {
  id: string;
  label: string;
  url?: string;
  version: string;
}

@Expose()
export class LegalSection<T extends ILegalSection = ILegalSection> extends BaseModel<T> {
  id: string;
  label: string;
  url?: string;
  version: string;
}

@Expose()
export class LegalSectionDetails extends LegalSection<LegalSectionDetails> {
  content: string;
  format?: 'html' | 'markdown';
}
