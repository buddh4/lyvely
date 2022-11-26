import { BaseModel, DocumentModel, PropertyType } from '@/models';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsString, Length, IsArray, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import {
  ContentVisibilityLevel,
  CreatedAsType,
  IContent,
  IContentAuthor,
  IContentDataType,
  IContentLog,
  IContentMetadata,
} from '../interfaces';
import { CreateHabitDto } from '@/activities';

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

  @Transform(({ value, obj }) => obj._id?.toString() || value)
  authorId: TObjectId;
}

@Expose()
export class ContentMetadataModel extends BaseModel<ContentMetadataModel> implements IContentMetadata<TObjectId> {
  @Transform(({ value, obj }) => obj._id?.toString() || value)
  createdBy: TObjectId;

  @Type(() => ContentAuthor)
  createdAs?: ContentAuthor;
  createdAt: Date;
  updatedAt: Date;
  streamSort: Date;
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
  @Transform(({ value, obj }) => obj._id?.toString() || value)
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

  @Transform(({ value, obj }) => obj._id?.toString() || value)
  oid: TObjectId;

  @Transform(({ value, obj }) => obj._id?.toString() || value)
  pid: TObjectId;

  type: string;

  content: ContentDataTypeModel;

  @Type(() => ContentMetadataModel)
  @PropertyType(ContentMetadataModel)
  meta: ContentMetadataModel;

  @IsArray()
  @Transform(({ obj }) => obj.tagIds?.map((id) => id.toString()) || [])
  tagIds: Array<TObjectId>;

  @IsArray()
  @Type(() => ContentLogModel)
  logs: Array<ContentLogModel>;

  config: TConfig;

  getDefaults() {
    return {
      config: this.getDefaultConfig(),
    };
  }

  getDefaultConfig(): TConfig {
    return undefined;
  }

  getSortOrder(): number {
    return this.meta.sortOrder;
  }
}
