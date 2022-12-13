import { Schema } from '@nestjs/mongoose';
import { SchemaOptions } from '@nestjs/mongoose/dist/decorators/schema.decorator';

export const SubSchema = (options?: SchemaOptions) =>
  Schema(Object.assign({ _id: false }, options));
