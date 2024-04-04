import { type StrictBaseDocumentData, type TObjectId } from '@/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, PropertyType } from '@lyvely/common';
import { File, FileVariant } from './file.schema';
import { ImageFileMetadata, ImageFileMetadataSchema } from './image-file-metadata.schema';
import type { ImageFileIF, ImageMetadataIF } from '../interfaces';

@Schema({ timestamps: true })
export class ImageFileVariant extends FileVariant<ImageFileIF<TObjectId>> {
  @Prop({ type: ImageFileMetadataSchema, required: true })
  override meta: ImageMetadataIF;

  constructor(file: ImageFileIF<any>, variant: string) {
    super(file, variant);
  }
}

export const ImageFileVariantSchema = SchemaFactory.createForClass(FileVariant);

/**
 * Represents the basic schema for files.
 */
@Schema({ timestamps: true })
export class ImageFile extends File<ImageFileMetadata, ImageFileVariant> {
  static readonly fileType = 'image';

  @Prop({ type: ImageFileMetadataSchema, required: true })
  @PropertyType(ImageFileMetadata)
  override meta: ImageFileMetadata;

  @Prop({ type: [ImageFileVariantSchema] })
  @PropertyType([ImageFileVariant], { optional: true })
  override variants?: ImageFileVariant[];

  override readonly type = ImageFile.fileType;

  constructor(data: StrictBaseDocumentData<File>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const ImageFileSchema = SchemaFactory.createForClass(File);
