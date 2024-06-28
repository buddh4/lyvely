import mongoose from 'mongoose';
import { InjectConnection as NestInjectConnection } from '@nestjs/mongoose';

export type TObjectId = mongoose.Types.ObjectId;
export type Model<T> = mongoose.Model<T>;
export type FilterQuery<T> = mongoose.FilterQuery<T>;

export type QueryOptions<DocType = unknown> = mongoose.QueryOptions<DocType>;
export type UpdateQuery<T> = mongoose.UpdateQuery<T>;

export type Schema<T = any> = mongoose.Schema<T>;

export const Document = mongoose.Document;
export type Subdocument = mongoose.Schema.Types.Subdocument;

export const InjectConnection = NestInjectConnection;
export type Connection = mongoose.Connection;

/**
 * Checks if the given object is a valid MongoDB ObjectId.
 *
 * @param obj The object to check.
 * @returns A boolean value indicating whether the object is a valid ObjectId.
 */
export function isObjectId(obj: any): obj is TObjectId {
  return obj instanceof mongoose.Types.ObjectId;
}

/**
 * Create a new Object ID using Mongoose.
 *
 * @param {string} [init] - Optional hex string to initialize the Object ID.
 * @return {mongoose.Types.ObjectId} - The newly created Object ID.
 */
export function createObjectId(init?: string) {
  return new mongoose.Types.ObjectId(init);
}
