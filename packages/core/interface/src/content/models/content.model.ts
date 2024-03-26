import {
  BaseModel,
  type PropertiesOf,
  PropertyType,
  TransformObjectId,
  TransformObjectIds,
  type PartialPropertiesOf,
  type BaseModelData,
} from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
import { IsString, Length, IsOptional } from 'class-validator';
import { getDefaultTypeMeta } from '../interfaces';
import type {
  CreatedAsType,
  IContentPolicies,
  IContent,
  IContentAuthor,
  IContentDataType,
  IContentLog,
  IContentMetadata,
  IContentTypeMeta,
} from '../interfaces';
import { RoleVisibilityLevel } from '@/profiles';

export class ContentDataTypeModel implements IContentDataType {
  @IsString()
  @Length(1, 80)
  @IsOptional()
  title?: string;

  @IsString()
  @Length(1, 500)
  @IsOptional()
  text?: string;

  constructor(data?: PropertiesOf<ContentDataTypeModel>) {
    if (!data) return;
    this.title = data.title;
    this.text = data.text;
  }
}

@Expose()
export class ContentAuthor<TID = string> implements IContentAuthor {
  type: CreatedAsType;

  @TransformObjectId()
  authorId: TID;

  constructor(data: ContentAuthor<any>) {
    BaseModel.init(this, data);
  }
}

@Expose()
export class ContentMetadataModel<TID = string> implements IContentMetadata<TID> {
  @TransformObjectId()
  mid?: TID;

  @TransformObjectId()
  createdBy: TID;

  @PropertyType(ContentAuthor, { optional: true })
  createdAs?: ContentAuthor<TID>;

  @PropertyType(Date)
  createdAt: Date;

  @PropertyType(Date)
  updatedAt: Date;

  @TransformObjectId()
  parentId?: TID;

  streamSort: number;
  sortOrder?: number;
  visibility: RoleVisibilityLevel;
  archived?: boolean;
  childCount?: number;
  locked?: boolean;

  constructor(data?: PropertiesOf<ContentMetadataModel<any>>) {
    BaseModel.init(this, data);
  }
}

@Expose()
export class ContentLogModel<TData = any, TID = string> implements IContentLog<TData, TID> {
  @TransformObjectId()
  updatedBy?: TID;

  updatedAt: Date;
  data?: TData;
  type: string;

  constructor(data?: ContentLogModel<TData, any>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class ContentModel<
  TID = string,
  TConfig extends Object | undefined = any,
  TState extends Object | undefined = any,
  TData extends ContentDataTypeModel = ContentDataTypeModel,
> implements IContent<TID, TConfig, TState, TData>
{
  @Expose()
  id: string;

  @Expose()
  @TransformObjectId()
  oid: TID;

  @Expose()
  @TransformObjectId()
  pid: TID;

  @Expose()
  type: string;

  @Expose()
  @PropertyType(ContentDataTypeModel, {})
  content: TData;

  @Expose()
  @PropertyType(ContentMetadataModel)
  meta: ContentMetadataModel<TID>;

  @Expose()
  @TransformObjectIds()
  tagIds: Array<TID>;

  @Expose()
  @PropertyType([ContentModel])
  logs: Array<ContentLogModel<any, TID>>;

  @Expose()
  config: TConfig;

  @Expose()
  state: TState;

  @Expose()
  policies: IContentPolicies;

  constructor(data: BaseModelData<ContentModel<any, TConfig, TState, TData>>) {
    BaseModel.init(this, data);
  }

  @Expose()
  getDefaults(): PartialPropertiesOf<ContentModel<TID, TConfig>> {
    return <any>{
      config: this.getDefaultConfig(),
      state: this.getDefaultState(),
    };
  }

  getDefaultConfig(): TConfig | undefined {
    return undefined;
  }

  getDefaultState(): TState | undefined {
    return undefined;
  }

  getTitle() {
    return this.content.title || '';
  }

  getText() {
    return this.content.text || '';
  }

  getSortOrder(): number | undefined {
    return this.meta.sortOrder;
  }

  getTypeMeta(): IContentTypeMeta {
    return getDefaultTypeMeta();
  }
}
