import { Injectable, Logger } from '@nestjs/common';
import { Content } from '../schemas';
import { AbstractTypeRegistry } from '@lyvely/server-core';

@Injectable()
export class ContentTypeRegistry extends AbstractTypeRegistry<Content> {
  protected logger = new Logger(ContentTypeRegistry.name);
}
