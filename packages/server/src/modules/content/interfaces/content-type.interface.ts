import { Type } from '@nestjs/common';
import { Content } from '../schemas';

export interface ContentTypeDefinition {
  type: string;
  moduleId: string,
  name: string;
  constructor: Type<Content>;
  description: string;
}