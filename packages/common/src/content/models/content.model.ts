import { BaseModel, DocumentModel, PropertyType } from '@/models';
import { Expose, Transform, Type } from 'class-transformer';
import { IsString, Length, IsArray, IsOptional } from 'class-validator';
import {
  ContentVisibilityLevel,
  CreatedAsType,
  IContent,
  IContentAuthor,
  IContentDataType,
  IContentLog,
  IContentMetadata,
} from '../interfaces';
import { TransformObjectId } from '@/utils';

export class ContentDataTypeModel<T extends IContentDataType = IContentDataType>
  extends BaseModel<T>
  implements IContentDataType
{
  @IsString()
  @Length(0, 80)
  @IsOptional()
  title?: string;

  @IsString()
  @Length(0, 500)
  @IsOptional()
  text?: string;
}

@Expose()
export class ContentAuthor extends BaseModel<ContentAuthor> implements IContentAuthor {
  type: CreatedAsType;

  @TransformObjectId()
  authorId: TObjectId;
}

@Expose()
export class ContentMetadataModel
  extends BaseModel<ContentMetadataModel>
  implements IContentMetadata<TObjectId>
{
  @TransformObjectId()
  createdBy: TObjectId;

  @Type(() => ContentAuthor)
  createdAs?: ContentAuthor;

  @PropertyType(Date)
  createdAt: Date;

  @TransformObjectId()
  parentId?: TObjectId;

  @PropertyType(Date)
  updatedAt: Date;
  streamSort: number;
  sortOrder?: number;
  visibility: ContentVisibilityLevel;
  isArchived?: boolean;
  isLocked?: boolean;
}

@Expose()
export class ContentLogModel<TData = any>
  extends BaseModel<IContentLog<TData, TObjectId>>
  implements IContentLog<TData, TObjectId>
{
  @TransformObjectId()
  updatedBy?: TObjectId;

  updatedAt: Date;
  data?: TData;
  type: string;
}

@Expose()
export class ContentModel<T extends IContent = IContent, TConfig extends Object = any>
  extends DocumentModel<T>
  implements IContent<TObjectId>
{
  id: string;

  @TransformObjectId()
  oid: TObjectId;

  @TransformObjectId()
  pid: TObjectId;

  type: string;

  @Type(() => ContentDataTypeModel)
  @PropertyType(ContentDataTypeModel)
  content: ContentDataTypeModel;

  @Type(() => ContentMetadataModel)
  @PropertyType(ContentMetadataModel)
  meta: ContentMetadataModel;

  @Transform(({ obj }) => obj.tagIds?.map((id) => id.toString()) || [])
  tagIds: Array<TObjectId>;

  @Type(() => ContentLogModel)
  logs: Array<ContentLogModel>;

  config: TConfig;

  getDefaults() {
    return {
      config: this.getDefaultConfig(),
    };
  }

  getTitle() {
    if (this.content?.title?.length) {
      return this.content.title;
    } else {
      return this.content.text;
    }
  }

  getDefaultConfig(): TConfig {
    return undefined;
  }

  getSortOrder(): number {
    return this.meta.sortOrder;
  }
}
