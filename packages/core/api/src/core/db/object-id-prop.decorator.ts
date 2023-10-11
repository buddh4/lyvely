import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropOptions } from '@nestjs/mongoose/dist/decorators/prop.decorator';

export const ObjectIdProp = (options?: PropOptions) =>
  Prop(Object.assign({ type: mongoose.Schema.Types.ObjectId }, options));

export const ObjectIdArrayProp = (options?: PropOptions) =>
  Prop(Object.assign({ type: [mongoose.Schema.Types.ObjectId] }, options));
