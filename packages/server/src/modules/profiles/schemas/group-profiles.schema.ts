import { Schema, SchemaFactory } from '@nestjs/mongoose';
import  mongoose from 'mongoose';
import { Profile } from "./profiles.schema";

@Schema({ timestamps: true })
export class GroupProfile extends Profile {}

export const GroupProfileSchema = SchemaFactory.createForClass(Profile);

export type GroupProfileDocument = GroupProfile & mongoose.Document;
