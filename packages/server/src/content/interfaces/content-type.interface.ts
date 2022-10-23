import { Type } from '@nestjs/common';
import { IContent } from '@lyvely/common';

export interface IContentTypeDefinition<T extends IContent = IContent> {
  type: string;
  moduleId: string;
  name: string;
  constructor: Type<T>;
  description: string;
}