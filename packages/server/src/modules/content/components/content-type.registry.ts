import { Injectable, Logger } from '@nestjs/common';
import { ContentTypeDefinition } from '../interfaces';

@Injectable()
export class ContentTypeRegistry {
  private contentTypeMapping: Record<string, ContentTypeDefinition> = {};
  private readonly logger = new Logger(ContentTypeRegistry.name);

  registerContentType(definition: ContentTypeDefinition) {
    this.logger.log(`Register content type ${definition.type}`);
    this.contentTypeMapping[definition.type] = definition;
  }

  registerContentTypes(definitions: ContentTypeDefinition[]) {
    definitions.forEach((def) => this.registerContentType(def));
  }

  isRegisteredType(type: string): boolean {
    return !!this.getTypeDefinition(type);
  }

  getTypeDefinition(type: string): ContentTypeDefinition | undefined {
    const result = this.contentTypeMapping[type];
    if(!result) {
      this.logger.warn(`Content type ${type} without content type definition requested`);
    }
    return result;
  }
}