import { Injectable, Logger } from '@nestjs/common';
import { ContentTypeDefinition } from '../interfaces';
import { Content } from '../schemas';

@Injectable()
export class ContentTypeRegistry {
  private contentTypeMapping: Record<string, ContentTypeDefinition<Content>> = {};
  private readonly logger = new Logger(ContentTypeRegistry.name);

  registerContentType(definition: ContentTypeDefinition<Content>) {
    this.logger.log(`Register content type ${definition.type}`);
    this.contentTypeMapping[definition.type] = definition;
  }

  registerContentTypes(definitions: ContentTypeDefinition<Content>[]) {
    definitions.forEach((def) => this.registerContentType(def));
  }

  isRegisteredType(type: string): boolean {
    return !!this.getTypeDefinition(type);
  }

  getTypeDefinition(type: string): ContentTypeDefinition<Content> | undefined {
    const result = this.contentTypeMapping[type];
    if (!result) {
      this.logger.warn(`Content type ${type} without content type definition requested`);
    }
    return result;
  }
}
