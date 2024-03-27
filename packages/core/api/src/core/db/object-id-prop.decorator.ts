import { Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PropOptions } from '@nestjs/mongoose/dist/decorators/prop.decorator';
import { Transform } from 'class-transformer';
import { isPlainObject } from '@lyvely/common';

export const ObjectIdProp = (options?: PropOptions): PropertyDecorator => {
  return function (target: any, propertyKey: string | symbol) {
    Transform(({ value }) => transformObjectId(value))(target, propertyKey);
    Prop(Object.assign({ type: mongoose.Schema.Types.ObjectId }, options))(target, propertyKey);
  };
};

export const ObjectIdArrayProp = (options?: PropOptions): PropertyDecorator => {
  return function (target: any, propertyKey: string | symbol) {
    Transform(({ value }) => transformObjectId(value))(target, propertyKey);
    Prop(Object.assign({ type: [mongoose.Schema.Types.ObjectId] }, options))(target, propertyKey);
  };
};

const transformObjectId = (value: any) =>
  isPlainObject(value) && value.toString ? value.toString() : value;
