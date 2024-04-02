import { type StrictBaseDocumentData } from '@/core';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, type Optional } from '@lyvely/common';
import { File } from './file.schema';

/**
 * Represents the basic schema for files.
 */
@Schema({ timestamps: true })
export class GenericFile extends File {
  static readonly fileType = 'generic';

  override type = GenericFile.fileType;

  constructor(data: StrictBaseDocumentData<Omit<Optional<File, 'guid' | 'region'>, 'type'>>) {
    super(false);
    BaseModel.init(this, data);
  }
}

export const GenericFileSchema = SchemaFactory.createForClass(GenericFile);
