import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../db/base.entity';
import { ICategory } from '@lyvely/common';

export type CategoryDocument = Tag & mongoose.Document;

@Schema()
export class Tag extends BaseEntity<Tag> implements ICategory {
  @Prop({ required: true })
  name: string;

  isNew: boolean;

  static create(obj: Partial<Tag>) {
    return new Tag({ isNew: true, ...obj });
  }

  protected afterInit() {
    super.afterInit();
    this.isNew = this.isNew ?? false;
  }
}

export const CategorySchema = SchemaFactory.createForClass(Tag);
