import { Content, ContentDocument } from '../schemas';
import { Injectable } from '@nestjs/common';
import { ContentTypeRegistry } from '../components';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeepPartial } from '@lyvely/common';
import { AbstractContentDao } from './abstract-content.dao';

@Injectable()
export class ContentDao extends AbstractContentDao<Content> {
  constructor(
    @InjectModel(Content.name) protected model: Model<ContentDocument>,
    protected contentTypeRegistry: ContentTypeRegistry,
  ) {
    super();
  }

  getModelConstructor(model?: DeepPartial<Content>) {
    return model && model.type && this.contentTypeRegistry.isRegisteredType(model.type)
      ? this.contentTypeRegistry.getTypeDefinition(model.type).constructor
      : Content;
  }

  getModuleId(): string {
    return 'content';
  }
}
