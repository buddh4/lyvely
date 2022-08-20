import mongoose from 'mongoose';

export {};

declare global {
  type TObjectId = mongoose.Types.ObjectId;
}
