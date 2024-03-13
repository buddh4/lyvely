import { BaseModel, type PropertiesOf } from '@lyvely/common';
import { Expose } from 'class-transformer';
import type { BaseModelData } from '@lyvely/common/src';

@Expose()
export class LegalSection {
  id: string;
  label: string;
  url?: string;
  version: string;

  constructor(data?: BaseModelData<LegalSection>) {
    BaseModel.init(this, data);
  }
}

@Expose()
export class LegalSectionDetails extends LegalSection {
  content?: string;
  format?: 'html' | 'markdown';

  constructor(data: PropertiesOf<LegalSectionDetails>) {
    super(false);
    BaseModel.init(this, data);
  }
}
