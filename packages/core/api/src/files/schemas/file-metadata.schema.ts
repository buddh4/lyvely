import { NestedSchema } from '@/core';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, type BaseModelData } from '@lyvely/common';

/**
 * Represents the basic metadata of a file, other file types may extend this schema.
 */
@NestedSchema()
export class FileMetadata {
  /** File size in bytes. **/
  @Prop({ required: true })
  size: number;

  /** File mime type. **/
  @Prop({ required: true })
  mime: string;

  /** Original file name. **/
  @Prop({ required: true })
  name: string;

  constructor(data: BaseModelData<FileMetadata>) {
    BaseModel.init(this, data);
  }
}

export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);
