import { Content, ContentDocument } from '../schemas';
import { Injectable } from '@nestjs/common';
import { ContentTypeRegistry } from '../components';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeepPartial } from '@lyvely/common';
import { AbstractContentDao } from './abstract-content.dao';
import { ProfileShard } from '@/profiles';
import { EntityIdentity } from '@/core';

@Injectable()
export class ContentDao extends AbstractContentDao<Content> {
  constructor(
    @InjectModel(Content.name) protected model: Model<ContentDocument>,
    protected contentTypeRegistry: ContentTypeRegistry,
  ) {
    super();
  }

  incrementChildCount(context: ProfileShard, parent: EntityIdentity<Content>) {
    return this.updateOneByProfileAndId(context, parent, { $inc: { 'meta.childCount': 1 } });
  }

  decrementChildCount(context: ProfileShard, parent: EntityIdentity<Content>) {
    return this.updateOneByProfileAndFilter(
      context,
      parent,
      { $inc: { 'meta.childCount': 1 } },
      { 'meta.childCount': { $gt: 0 } },
    );
  }

  getModelConstructor(model?: DeepPartial<Content>) {
    return model?.type && this.contentTypeRegistry.isRegisteredType(model.type)
      ? this.contentTypeRegistry.getTypeConstructor(model.type)
      : Content;
  }

  getModuleId(): string {
    return 'content';
  }
}
