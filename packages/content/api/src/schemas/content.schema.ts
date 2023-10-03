import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { DeepPartial, PropertyType, assignRawDataTo, Type, PropertiesOf } from '@lyvely/common';
import { IContent, ContentModel } from '@lyvely/content-interface';
import { BaseEntity, ObjectIdArrayProp } from '@lyvely/core';
import { ContentLog, ContentLogSchema } from './content-log.schema';
import { ContentMetadata, ContentMetadataSchema } from './content.metadata.schema';
import { CreatedAs, Author } from './content-author.schema';
import { User } from '@lyvely/users';
import {
  Profile,
  BaseProfileModel,
  Tag,
  ProfileContext,
  ProfileUserContext,
} from '@lyvely/profiles';
import { ContentDataType, ContentDataTypeSchema } from './content-data-type.schema';
import { IPolicy } from '@lyvely/policies';

export class ProfileContentContext<
  TContent extends Content = Content,
  TProfile extends Profile = Profile,
> extends ProfileContext<TProfile> {
  content: TContent;
}

export class ProfileUserContentContext<
  TContent extends Content = Content,
  TProfile extends Profile = Profile,
> extends ProfileUserContext<TProfile> {
  content: TContent;
}

export type ContentDocument = Content & mongoose.Document;

type IGetModelConstructor = {
  getModelConstructor: () => any;
};

function implementsGetModelConstructor(model: any): model is IGetModelConstructor {
  return typeof (model as IGetModelConstructor).getModelConstructor === 'function';
}

export type ContentEntity<T, TConfig extends Object = any> = IContent<Types.ObjectId, TConfig> &
  BaseEntity<T>;

@Schema({ discriminatorKey: 'type' })
export class Content<
    T extends ContentEntity<T, TConfig> = any,
    TConfig extends Object = any,
    TData extends ContentDataType = ContentDataType,
  >
  extends BaseProfileModel<T>
  implements IContent<Types.ObjectId, TConfig>
{
  @Prop({ type: ContentDataTypeSchema })
  @PropertyType(ContentDataType)
  content: TData;

  @Prop({ type: ContentMetadataSchema })
  @PropertyType(ContentMetadata)
  meta: ContentMetadata;

  @Prop({ type: [ContentLogSchema], default: [] })
  @PropertyType([ContentLog])
  logs: ContentLog[];

  @ObjectIdArrayProp({ default: [] })
  tagIds: Types.ObjectId[];

  config: any;

  type: string;

  constructor(profile: Profile, createdBy: User, obj: DeepPartial<T> = {}) {
    obj.meta = obj.meta || new ContentMetadata();
    obj.meta.createdBy = createdBy._id;
    obj.meta.createdAs = obj.meta.createdAs || new CreatedAs(createdBy);
    obj.pid = profile._id;
    obj.oid = profile.oid;
    super(obj);
  }

  static collectionName() {
    return 'contents';
  }

  /**
   * @deprecated this should be part of a helper function instead, updates should not be applied on the model itself, but
   * only on the query
   */
  applyContentUpdate(update: Partial<TData>) {
    this.content = assignRawDataTo(this.content || ({} as TData), update);
  }

  getDefaults(): Partial<PropertiesOf<T>> {
    // not really sure why the cast is required...
    return <any>{
      config: this.getDefaultConfig(),
    };
  }

  hasParent() {
    return !!this.meta.parentId;
  }

  getParentId() {
    return this.meta.parentId;
  }

  getDefaultConfig(): TConfig | undefined {
    return undefined;
  }

  addTag(tag: Tag) {
    if (tag) this.tagIds.push(tag._id);
  }

  getSortOrder() {
    return this.meta.sortOrder;
  }

  setAuthor(author: Author) {
    this.setAuthor(author);
  }

  toModel(user?: User): ContentModel<any> {
    const ModelConstructor: Type<ContentModel> = implementsGetModelConstructor(this)
      ? this.getModelConstructor()
      : ContentModel;

    return new ModelConstructor(this);
  }

  getTitle() {
    return this.content?.title || '';
  }

  getText() {
    return this.content?.text || '';
  }

  getWritePolicy(): Type<IPolicy<ProfileContentContext>> | null {
    return null;
  }

  getManagePolicy(): Type<IPolicy<ProfileContentContext>> | null {
    return null;
  }

  getReadPolicy(): Type<IPolicy<ProfileContentContext>> | null {
    return null;
  }
}

export abstract class ContentType<
  T extends ContentEntity<T, TConfig>,
  TConfig extends Object = any,
  TData extends ContentDataType = ContentDataType,
  TModel extends ContentModel<any> = ContentModel<any>,
> extends Content<T, TConfig, TData> {
  abstract toModel(user?: User): TModel;
}

export const ContentSchema = SchemaFactory.createForClass(Content);

export function getContentModelDefinition(definitions: ModelDefinition[]): ModelDefinition {
  return {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: definitions,
  };
}

//ContentSchema.index({ oid: 1, pid: 1, 'content.$**': 'text' });
