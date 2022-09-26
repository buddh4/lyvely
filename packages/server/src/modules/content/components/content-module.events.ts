import { Inject } from '@nestjs/common';
import { ContentTypeDefinition } from "../interfaces";
import { ContentTypeRegistry } from './content-type.registry';
import { ModuleEvents } from '../../core/modules/module.events';

export abstract class ContentModuleEvents extends ModuleEvents {

  @Inject()
  private contentTypeRegistry: ContentTypeRegistry

  abstract getContentTypes(): ContentTypeDefinition[];

  onModuleInit(): any {
    super.onModuleInit();
    this.registerContentTypes();
  }

  private registerContentTypes() {
    const contentTypes = this.getContentTypes();
    if(contentTypes && contentTypes.length) {
      this.contentTypeRegistry.registerContentTypes(contentTypes);
    }
  }
}
