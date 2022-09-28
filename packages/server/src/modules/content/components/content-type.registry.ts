import { Injectable, Logger } from '@nestjs/common';
import { IContentTypeDefinition } from '../interfaces';
import { Content } from '../schemas';

@Injectable()
export class ContentTypeRegistry {
  private contentTypeMapping: Record<string, IContentTypeDefinition<Content>> = {};
  private readonly logger = new Logger(ContentTypeRegistry.name);

  registerContentType(definition: IContentTypeDefinition<Content>) {
    this.logger.log(`Register content type ${definition.type}`);
    this.contentTypeMapping[definition.type] = definition;
  }

  registerContentTypes(definitions: IContentTypeDefinition<Content>[]) {
    definitions.forEach((def) => this.registerContentType(def));
  }

  isRegisteredType(type: string): boolean {
    return !!this.getTypeDefinition(type);
  }

  getTypeDefinition(type: string): IContentTypeDefinition<Content> | undefined {
    const result = this.contentTypeMapping[type];
    if (!result) {
      this.logger.warn(`Content type ${type} without content type definition requested`);
    }
    return result;
  }
}
