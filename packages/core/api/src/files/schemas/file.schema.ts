import {
  DEFAULT_REGION,
  NestedSchema,
  ObjectIdProp,
  type StrictBaseDocumentData,
  type TObjectId,
  uniqueGuid,
} from '@/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, type Optional, PropertyType } from '@lyvely/common';
import { FileMetadata, FileMetadataSchema } from './file-metadata.schema';
import type { IFileVariant, IFile } from '../interfaces';

/**
 * Represents a base file variant
 */
@NestedSchema({ timestamps: true })
export class FileVariant<TFile extends IFile<TObjectId> = IFile<TObjectId>>
  implements IFileVariant<TObjectId, TFile['meta']>
{
  @Prop({ required: true })
  fguid: string;

  @Prop({ required: true })
  variant: string;

  @Prop({ required: true })
  bucket: string;

  @Prop({ required: true })
  @PropertyType(String, { default: DEFAULT_REGION })
  region: string;

  @Prop({ required: true })
  guid: string;

  @Prop({ type: FileMetadataSchema, required: true })
  meta: TFile['meta'];

  @ObjectIdProp({ required: true })
  createdBy: TObjectId;

  constructor(file: TFile, variant: string, createdBy?: TObjectId) {
    BaseModel.init(this);
    this.fguid = file.guid;
    this.variant = variant;
    this.bucket = file.bucket;
    this.region = file.region;
    this.guid = uniqueGuid();
    this.createdBy = createdBy || file.createdBy;
    this.meta = { ...file.meta };
  }

  static collectionName() {
    return 'Files';
  }

  createdAt: Date;
  updatedAt: Date;
}

export const FileVariantSchema = SchemaFactory.createForClass(FileVariant);

/**
 * Represents the basic schema for files.
 */
@Schema({ discriminatorKey: 'type', timestamps: true })
export class File<
  TMeta extends FileMetadata = FileMetadata,
  TVariant extends IFileVariant<TObjectId, TMeta> = IFileVariant<TObjectId, TMeta>,
> implements IFile<TObjectId, TMeta, TVariant>
{
  @Prop({ required: true })
  @PropertyType(String, { default: uniqueGuid })
  guid: string;

  @Prop({ required: true })
  bucket: string;

  @Prop({ required: true })
  @PropertyType(String, { default: DEFAULT_REGION })
  region: string;

  @ObjectIdProp()
  oid?: TObjectId;

  @ObjectIdProp()
  pid?: TObjectId;

  @ObjectIdProp({ required: true })
  createdBy: TObjectId;

  @Prop({ type: FileMetadataSchema, required: true })
  @PropertyType(FileMetadata)
  meta: TMeta;

  @Prop({ type: FileVariantSchema })
  @PropertyType([FileVariant], { optional: true })
  variants?: TVariant[];

  type: string;

  id: string;
  _id: TObjectId;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: StrictBaseDocumentData<Omit<Optional<File, 'guid' | 'region'>, 'type'>>) {
    BaseModel.init(this, data);
  }
}

export const FileSchema = SchemaFactory.createForClass(File);
