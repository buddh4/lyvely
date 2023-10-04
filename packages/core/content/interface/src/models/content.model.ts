import {
  BaseModel,
  DocumentModel,
  PropertyType,
  TransformObjectId,
  PropertiesOf,
} from '@lyvely/common';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsString, Length, IsOptional } from 'class-validator';
import {
  CreatedAsType,
  IContent,
  IContentAuthor,
  IContentDataType,
  IContentLog,
  IContentMetadata,
} from '../interfaces';
import { RoleVisibilityLevel } from '@lyvely/profiles';

export class ContentDataTypeModel<T extends IContentDataType = IContentDataType>
  extends BaseModel<T>
  implements IContentDataType
{
  @IsString()
  @Length(1, 80)
  @IsOptional()
  title?: string;

  @IsString()
  @Length(1, 500)
  @IsOptional()
  text?: string;
}

@Expose()
export class ContentAuthor<TID = string>
  extends BaseModel<ContentAuthor>
  implements IContentAuthor
{
  type: CreatedAsType;

  @TransformObjectId()
  authorId: TID;
}

@Expose()
export class ContentMetadataModel<TID = string>
  extends BaseModel<ContentMetadataModel>
  implements IContentMetadata<TID>
{
  @TransformObjectId()
  mid?: TID;

  @TransformObjectId()
  createdBy: TID;

  @Type(() => ContentAuthor)
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
}

@Expose()
export class ContentLogModel<TData = any, TID = string>
  extends BaseModel<IContentLog<TData, TID>>
  implements IContentLog<TData, TID>
{
  @TransformObjectId()
  updatedBy?: TID;

  updatedAt: Date;
  data?: TData;
  type: string;
}

@Exclude()
export class ContentModel<TID = string, T extends IContent = IContent, TConfig extends Object = any>
  extends DocumentModel<T>
  implements IContent<TID>
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
  @Type(() => ContentDataTypeModel)
  @PropertyType(ContentDataTypeModel)
  content: ContentDataTypeModel;

  @Expose()
  @Type(() => ContentMetadataModel)
  @PropertyType(ContentMetadataModel)
  meta: ContentMetadataModel<TID>;

  @Expose()
  @Transform(({ obj }) => obj.tagIds?.map((id) => id.toString()) || [])
  tagIds: Array<TID>;

  @Expose()
  @Type(() => ContentLogModel)
  logs: Array<ContentLogModel<any, TID>>;

  @Expose()
  config: TConfig;

  @Expose()
  getDefaults(): Partial<PropertiesOf<T>> {
    return <any>{
      config: this.getDefaultConfig(),
    };
  }

  getTitle() {
    return this.content.title || '';
  }

  getText() {
    return this.content.text || '';
  }

  getDefaultConfig(): TConfig | undefined {
    return undefined;
  }

  getSortOrder(): number | undefined {
    return this.meta.sortOrder;
  }
}
