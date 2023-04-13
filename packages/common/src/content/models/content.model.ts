import { BaseModel, DocumentModel, PropertyType } from '@/models';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsString, Length, IsOptional } from 'class-validator';
import {
  ContentVisibilityLevel,
  CreatedAsType,
  IContent,
  IContentAuthor,
  IContentDataType,
  IContentLog,
  IContentMetadata,
} from '../interfaces';
import { TransformObjectId, PropertiesOf } from '@/utils';

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
  authorId: TObjectId;
}

@Expose()
export class ContentMetadataModel
  extends BaseModel<ContentMetadataModel>
  implements IContentMetadata<TObjectId>
{
  @TransformObjectId()
  mid?: TObjectId;

  @TransformObjectId()
  createdBy: TObjectId;

  @Type(() => ContentAuthor)
  createdAs?: ContentAuthor;

  @PropertyType(Date)
  createdAt: Date;

  @PropertyType(Date)
  updatedAt: Date;

  @TransformObjectId()
  parentId?: TObjectId;

  streamSort: number;
  sortOrder?: number;
  visibility: ContentVisibilityLevel;
  archived?: boolean;
  locked?: boolean;
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

@Exclude()
export class ContentModel<T extends IContent = IContent, TConfig extends Object = any>
  extends DocumentModel<T>
  implements IContent<TObjectId>
{
  @Expose()
  id: string;

  @Expose()
  @TransformObjectId()
  oid: TObjectId;

  @Expose()
  @TransformObjectId()
  pid: TObjectId;

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
  tagIds: Array<TObjectId>;

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
    return this.content.title;
  }

  getText() {
    return this.content.text;
  }

  getDefaultConfig(): TConfig {
    return undefined;
  }

  getSortOrder(): number {
    return this.meta.sortOrder;
  }
}
