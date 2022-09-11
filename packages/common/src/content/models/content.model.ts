import { DocumentModel } from "../../model";
import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString, Length, IsArray, IsNumber, IsBoolean, IsEnum } from "class-validator";
import { ContentVisibilityLevel, IContent } from "../interfaces";

@Expose()
export class ContentModel<T extends IContent = IContent> extends DocumentModel<T> implements IContent {
  type: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 80)
  title: string;

  @IsString()
  @Length(0, 500)
  text: string;

  @IsArray()
  @Transform(({ obj }) => obj.tagIds?.map(id => id.toString()) || [])
  tagIds: TObjectId[];

  @IsNumber()
  @IsEnum(ContentVisibilityLevel)
  visibility: number;

  @IsBoolean()
  archived: boolean;

  constructor(obj?: Partial<T>) {
    super(obj);
    // Not sure in which case we need this, was taken from activity dto...
    this.archived = !!this.archived;
    this.tagIds = this.tagIds || [];
  }
}
