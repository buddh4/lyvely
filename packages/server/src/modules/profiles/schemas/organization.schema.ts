import { Schema, SchemaFactory } from '@nestjs/mongoose';
import  mongoose from 'mongoose';
import { Profile } from "./profiles.schema";

@Schema({ timestamps: true })
export class Organization extends Profile {}

export const OrganizationSchema = SchemaFactory.createForClass(Profile);
export type OrganizationDocument = Organization & mongoose.Document;
