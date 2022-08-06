import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../db/base.entity';
import { ICategory } from '@lyvely/common';

export type CategoryDocument = Category & mongoose.Document;

@Schema()
export class Category extends BaseEntity<Category> implements ICategory {
  @Prop({ required: true })
  name: string;

  public static create(obj: Partial<Category>) {
    const model = new Category();
    return Object.assign(model, obj);
  }
}

export const CategorySchema = SchemaFactory.createForClass(Category);
