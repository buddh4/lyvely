import { NestedSchema } from '@/core';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import type { IFileMetadata } from '../interfaces';

/**
 * Represents the basic metadata of a file, other file types may extend this schema.
 */
@NestedSchema()
export class FileMetadata implements IFileMetadata {
  /** File size in bytes. **/
  @Prop({ required: true })
  size: number;

  /** File mime type. **/
  @Prop({ required: true })
  mimetype: string;

  /** Original file name. **/
  @Prop({ required: true })
  filename: string;

  constructor(data: BaseModelData<FileMetadata>) {
    BaseModel.init(this, data);
  }
}

export const FileMetadataSchema = SchemaFactory.createForClass(FileMetadata);
