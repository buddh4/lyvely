import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropOptions } from '@nestjs/mongoose/dist/decorators/prop.decorator';

export const MixedProp = (options?: PropOptions) =>
  Prop(Object.assign({ type: mongoose.Schema.Types.Mixed }, options));
