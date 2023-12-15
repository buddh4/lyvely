import { Prop, Schema, SchemaFactory, ModelDefinition } from '@nestjs/mongoose';
import { DeepPartial, PropertyType, assignRawDataTo, Type, PropertiesOf } from '@lyvely/common';
import {
  IContent,
  ContentModel,
  ContentUserRole,
  getDefaultTypeMeta,
  IContentTypeMeta,
} from '@lyvely/interface';
import {
  assureObjectId,
  BaseDocument,
  DocumentIdentity,
  ObjectIdArrayProp,
  TObjectId,
} from '@/core';
import { ContentLog, ContentLogSchema } from './content-log.schema';
import { ContentMetadata, ContentMetadataSchema } from './content-metadata.schema';
import { CreatedAs, Author } from './content-author.schema';
import { OptionalUser, User } from '@/users';
import {
  Profile,
  BaseProfileModel,
  Tag,
  ProfileContext,
  ProtectedProfileContext,
} from '@/profiles';
import { ContentDataType, ContentDataTypeSchema } from './content-data-type.schema';
import { IPolicy } from '@/policies';
import type { IContentPolicies } from '@lyvely/interface';

export class ProfileContentContext<
  TContent extends Content = Content,
  TProfile extends Profile = Profile,
> extends ProfileContext<TProfile> {
  content: TContent;

  constructor(obj: Partial<ProfileContentContext>) {
    super(obj);
  }

  getContentRole(): ContentUserRole {
    if (!this.user) return ContentUserRole.Visitor;
    if (!this.content.isManager(this.user)) return ContentUserRole.Manager;
    if (!this.content.isAuthor(this.user)) return ContentUserRole.Author;
    if (!this.content.isAssigned(this.user)) return ContentUserRole.Assignee;
    return (<any>this.getRole()) as ContentUserRole;
  }
}

export class ProtectedProfileContentContext<
  TContent extends Content = Content,
  TProfile extends Profile = Profile,
> extends ProtectedProfileContext<TProfile> {
  content: TContent;
}

type IGetModelConstructor = {
  getModelConstructor: () => any;
};

function implementsGetModelConstructor(model: any): model is IGetModelConstructor {
  return typeof (model as IGetModelConstructor).getModelConstructor === 'function';
}

export type ContentEntity<T, TConfig extends Object = any> = IContent<TObjectId, TConfig> &
  BaseDocument<T>;

/**
 * This class implements the base schema of all content types. Subclasses may overwrite the `content`, `config` or
 * `state` properties for content specific data.
 *
 * The `content` property can be extended with content type specific data, representing the base content of a content
 * type. Data included in this property should be candidate to duplication of a content instance.
 *
 * The `config` property may contain content specific configurations.
 *
 * The `state` property may contain content specific state information.
 */
@Schema({ discriminatorKey: 'type' })
export class Content<
    T extends ContentEntity<T, TConfig> = any,
    TConfig extends Object = any,
    TData extends ContentDataType = ContentDataType,
  >
  extends BaseProfileModel<T>
  implements IContent<TObjectId, TConfig>
{
  /** The content field holds the core data for the content instance. **/
  @Prop({ type: ContentDataTypeSchema })
  @PropertyType(ContentDataType)
  content: TData;

  /** The meta field contains metadata associated with the content instance. **/
  @Prop({ type: ContentMetadataSchema })
  @PropertyType(ContentMetadata)
  meta: ContentMetadata;

  /** The logs field stores event data related to the content instance (planned for future use). **/
  @Prop({ type: [ContentLogSchema], default: [] })
  @PropertyType([ContentLog])
  logs: ContentLog[];

  /** Array of tag ids attached to this content **/
  @ObjectIdArrayProp({ default: [] })
  tagIds: TObjectId[];

  /** Additional configuration data (may vary by content type) **/
  config: any;

  /** The state field (optional) represents content-specific state information. **/
  state?: any;

  /** The type discriminator field identifies the content type. **/
  type: string;

  /** Contains the users content policy results, which need to be populated manually and are not persisted. **/
  policies: IContentPolicies;

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

  /**
   * Prepares default values of a new content instance.
   */
  getDefaults(): Partial<PropertiesOf<T>> {
    // not really sure why the cast is required...
    return <any>{
      config: this.getDefaultConfig(),
    };
  }

  /**
   * Whether this content is part of a sub content discussion.
   */
  hasParent() {
    return !!this.meta.parentId;
  }

  /**
   * Returns the id of the parent content, in case this content is part of a sub content discussion.
   */
  getParentId() {
    return this.meta.parentId;
  }

  /**
   * Returns the default configuration of this content.
   */
  getDefaultConfig(): TConfig | undefined {
    return undefined;
  }

  /**
   * Attaches the given tag to this content instance in case it is not already attached.
   * @param tag The tag instance to be attached.
   */
  addTag(tag: Tag) {
    if (this.tagIds.find((tagId) => tagId.equals(tag._id))) return;
    if (tag) this.tagIds.push(tag._id);
  }

  /**
   * Returns a content type specific sort order value. The module related to the content type is responsible for managing
   * this sortOrder.
   */
  getSortOrder() {
    return this.meta.sortOrder;
  }

  /**
   * Sets an author of this content.
   * @param author The author of this content.
   */
  setAuthor(author: Author) {
    this.meta.setAuthor(author);
  }

  /**
   * Checks if the given user is the author of the content.
   *
   * @param {DocumentIdentity<User>} user - The user to check if they are the author.
   * @returns {boolean} - True if the user is the author, false otherwise.
   */
  isAuthor(user: OptionalUser): boolean {
    if (!user) return false;
    return this.meta.createdBy.equals(assureObjectId(user));
  }

  /**
   * Checks if the given user is a manager of this content.
   *
   * This is the case if the user is the author of this content  there is no
   *
   * @param {DocumentIdentity<User>} user - The user to check if they are a manager.
   * @returns {boolean} - Returns true if the user is a manager, false otherwise.
   */
  isManager(user: OptionalUser): boolean {
    if (!user) return false;
    return !!this.meta.managers?.includes(assureObjectId(user));
  }

  /**
   * Checks if a user is assigned to the content.
   *
   * @param {DocumentIdentity<User>} user - The user to check if assigned to the document.
   *
   * @return {boolean} - True if the user is assigned to the document, false otherwise.
   */
  isAssigned(user: OptionalUser): boolean {
    if (!user) return false;
    return !!this.meta.assignees?.includes(assureObjectId(user));
  }

  /**
   * Retrieves the content type metadata for the content type, which is static metadata which describes the behavior
   * of a content type.
   *
   * @returns {IContentTypeMeta} The metadata for the content type.
   */
  getTypeMeta(): IContentTypeMeta {
    return getDefaultTypeMeta();
  }

  /**
   * Used to create a model instance out of this content type. Some content types may return user specific model data.
   * Subclasses either overwrite this function or implement a `getModelConstructor` function returning the constructor
   * of the model.
   * @param user The user for which this model should be created.
   */
  toModel(user?: User): ContentModel<any> {
    const ModelConstructor: Type<ContentModel> = implementsGetModelConstructor(this)
      ? this.getModelConstructor()
      : ContentModel;

    return new ModelConstructor(this);
  }

  /**
   * Returns the title of this content or an empty string by default.
   */
  getTitle(): string {
    return this.content?.title || '';
  }

  /**
   * Returns the text of this content or an empty string by default.
   */
  getText(): string {
    return this.content?.text || '';
  }

  /**
   * Can be overwritten in order to return a content type specific write policy.
   */
  getWritePolicy(): Type<IPolicy<ProfileContentContext>> | null {
    return null;
  }

  /**
   * Can be overwritten in order to return a content type specific delete policy.
   */
  getDeletePolicy(): Type<IPolicy<ProfileContentContext>> | null {
    return null;
  }

  /**
   * Can be overwritten in order to return a content type specific manage policy.
   */
  getManagePolicy(): Type<IPolicy<ProfileContentContext>> | null {
    return null;
  }

  /**
   * Can be overwritten in order to return a content type specific read policy.
   */
  getReadPolicy(): Type<IPolicy<ProfileContentContext>> | null {
    return null;
  }
}

/**
 * This class serves as base class for all custom content types.
 */
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
