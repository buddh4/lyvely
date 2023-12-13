import { Content } from '../schemas';
import { Injectable } from '@nestjs/common';
import { ContentTypeRegistry } from '../components';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentIdentity } from '@/core';
import { DeepPartial } from '@lyvely/common';
import { ContentTypeDao } from './content-type.dao';
import { ProfileShard } from '@/profiles';

@Injectable()
export class ContentDao extends ContentTypeDao<Content> {
  constructor(
    @InjectModel(Content.name) protected model: Model<Content>,
    protected contentTypeRegistry: ContentTypeRegistry,
  ) {
    super();
  }

  incrementChildCount(context: ProfileShard, parent: DocumentIdentity<Content>) {
    return this.updateOneByProfileAndId(context, parent, { $inc: { 'meta.childCount': 1 } });
  }

  decrementChildCount(context: ProfileShard, parent: DocumentIdentity<Content>) {
    return this.updateOneByProfileAndFilter(
      context,
      parent,
      { $inc: { 'meta.childCount': 1 } },
      { 'meta.childCount': { $gt: 0 } },
    );
  }

  getModelConstructor(model: DeepPartial<Content>) {
    return model?.type && this.contentTypeRegistry.isRegisteredType(model.type)
      ? this.contentTypeRegistry.getTypeConstructor(model.type) || Content
      : Content;
  }

  getModuleId(): string {
    return 'content';
  }
}
