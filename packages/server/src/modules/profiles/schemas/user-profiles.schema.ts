import { Schema, SchemaFactory } from '@nestjs/mongoose';
import  mongoose from 'mongoose';
import { Profile } from "./profiles.schema";
import { ProfileType } from "@lyvely/common";
import { User } from "../../users";

@Schema({ timestamps: true })
export class UserProfile extends Profile {

  constructor(createdBy: User, obj?: Partial<UserProfile>) {
    super(createdBy, obj);
    this.type = ProfileType.User;
  }
}

export type UserProfileDocument = UserProfile & mongoose.Document;

export const UserProfileSchema = SchemaFactory.createForClass(Profile);
