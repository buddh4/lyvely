import { Type } from '@nestjs/common';
import { Content } from '../schemas';

export interface IContentTypeDefinition<T extends Content = Content> {
  type: string;
  constructor: Type<T>;
}
