import { NestedSchema } from '@/core';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import { FileMetadata } from './file-metadata.schema';

/**
 * Represents the basic metadata of a file, other file types may extend this schema.
 */
@NestedSchema()
export class ImageFileMetadata extends FileMetadata {
  @Prop()
  height?: number;

  @Prop()
  width?: number;

  constructor(data: BaseModelData<ImageFileMetadata>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const ImageFileMetadataSchema = SchemaFactory.createForClass(ImageFileMetadata);
