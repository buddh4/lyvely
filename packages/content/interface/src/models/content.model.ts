import { BaseModel, DocumentModel, PropertyType } from '@lyvely/common';
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
import { TransformObjectId, PropertiesOf } from '@lyvely/common';
import * as mongoose from 'mongoose';
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
export class ContentAuthor extends BaseModel<ContentAuthor> implements IContentAuthor {
  type: CreatedAsType;

  @TransformObjectId()
  authorId: mongoose.Types.ObjectId;
}

@Expose()
export class ContentMetadataModel
  extends BaseModel<ContentMetadataModel>
  implements IContentMetadata<mongoose.Types.ObjectId>
{
  @TransformObjectId()
  mid?: mongoose.Types.ObjectId;

  @TransformObjectId()
  createdBy: mongoose.Types.ObjectId;

  @Type(() => ContentAuthor)
  createdAs?: ContentAuthor;

  @PropertyType(Date)
  createdAt: Date;

  @PropertyType(Date)
  updatedAt: Date;

  @TransformObjectId()
  parentId?: mongoose.Types.ObjectId;

  streamSort: number;
  sortOrder?: number;
  visibility: RoleVisibilityLevel;
  archived?: boolean;
  childCount?: number;
  locked?: boolean;
}

@Expose()
export class ContentLogModel<TData = any>
  extends BaseModel<IContentLog<TData, mongoose.Types.ObjectId>>
  implements IContentLog<TData, mongoose.Types.ObjectId>
{
  @TransformObjectId()
  updatedBy?: mongoose.Types.ObjectId;

  updatedAt: Date;
  data?: TData;
  type: string;
}

@Exclude()
export class ContentModel<T extends IContent = IContent, TConfig extends Object = any>
  extends DocumentModel<T>
  implements IContent<mongoose.Types.ObjectId>
{
  @Expose()
  id: string;

  @Expose()
  @TransformObjectId()
  oid: mongoose.Types.ObjectId;

  @Expose()
  @TransformObjectId()
  pid: mongoose.Types.ObjectId;

  @Expose()
  type: string;

  @Expose()
  @Type(() => ContentDataTypeModel)
  @PropertyType(ContentDataTypeModel)
  content: ContentDataTypeModel;

  @Expose()
  @Type(() => ContentMetadataModel)
  @PropertyType(ContentMetadataModel)
  meta: ContentMetadataModel;

  @Expose()
  @Transform(({ obj }) => obj.tagIds?.map((id) => id.toString()) || [])
  tagIds: Array<mongoose.Types.ObjectId>;

  @Expose()
  @Type(() => ContentLogModel)
  logs: Array<ContentLogModel>;

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
