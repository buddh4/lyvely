import { Schema } from '@nestjs/mongoose';
import { SchemaOptions } from '@nestjs/mongoose/dist/decorators/schema.decorator';

export const NestedSchema = (options?: SchemaOptions) =>
  Schema(Object.assign({ _id: false }, options));
