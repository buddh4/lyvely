import { Injectable, Logger } from '@nestjs/common';
import { Content } from '../schemas';
import { AbstractTypeRegistry } from '@/core/components/abstract-type.registry';

@Injectable()
export class ContentTypeRegistry extends AbstractTypeRegistry<Content> {
  constructor() {
    super(new Logger(ContentTypeRegistry.name));
  }
}
