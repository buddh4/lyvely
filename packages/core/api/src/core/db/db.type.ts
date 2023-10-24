import mongoose from 'mongoose';
import { InjectConnection as NestInjectConnection } from '@nestjs/mongoose';

export type TObjectId = mongoose.Types.ObjectId;
export type Model<T> = mongoose.Model<T>;
export type FilterQuery<T> = mongoose.FilterQuery<T>;

export type QueryOptions<DocType = unknown> = mongoose.QueryOptions<DocType>;
export type UpdateQuery<T> = mongoose.UpdateQuery<T>;

export type Schema<T> = mongoose.Schema<T>;

export const Document = mongoose.Document;
export type SubDocument = mongoose.Schema.Types.Subdocument;

export const InjectConnection = NestInjectConnection;
export type Connection = mongoose.Connection;

export function isObjectId(obj: any): obj is TObjectId {
  return obj instanceof mongoose.Types.ObjectId;
}

export function createObjectId(init?: string) {
  return new mongoose.Types.ObjectId(init);
}
