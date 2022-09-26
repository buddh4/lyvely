import { Type } from '@nestjs/common';
import { IContent } from '@lyvely/common';

export interface ContentTypeDefinition {
  type: string;
  moduleId: string,
  name: string;
  constructor: Type<IContent>;
  description: string;
}
