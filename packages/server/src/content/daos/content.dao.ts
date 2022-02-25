import { Content, ContentDocument } from '../schemas';
import { AbstractContentDao } from './abstract-content.dao';
import { Injectable } from '@nestjs/common';
import { ContentTypeRegistry } from '../components';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constructor } from 'lyvely-common';

@Injectable()
export class ContentDao extends AbstractContentDao<Content> {

  constructor(
    @InjectModel(Content.name) protected model: Model<ContentDocument>,
    protected contentTypeRegistry: ContentTypeRegistry
  ) {
    super();
  }

  protected createModel(lean?: Partial<Content>): Content {
    if(!lean) return null;

    const Constructor = this.contentTypeRegistry.isRegisteredType(lean.type)
      ? this.contentTypeRegistry.getTypeDefinition(lean.type).constructor
      : Content;
    return new Constructor(lean);
  }

  getModelConstructor(): Constructor<Content> {
    return Content;
  }

  getModuleId(): string {
    return 'content';
  }
}