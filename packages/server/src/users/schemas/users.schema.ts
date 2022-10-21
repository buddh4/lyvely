import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import mongoose, { UpdateQuery } from 'mongoose';
import { BaseEntity, validateEmail } from '@/core';
import { Length } from 'class-validator';
import { RefreshToken, RefreshTokenSchema } from './refresh.tokens.schema';
import crypto from 'crypto';
import { PropertiesOf, UserModel, UserEmailModel, getNumberEnumValues, UserStatus, PropertyType } from '@lyvely/common';

@Schema({ id: false })
export class ProfilesCount {
  @PropertyType(Number, { default: 0 })
  @Prop({ required: true, min: 0, default: 0 })
  user: number;

  @PropertyType(Number, { default: 0 })
  @Prop({ required: true, min: 0, default: 0 })
  group: number;

  @PropertyType(Number, { default: 0 })
  @Prop({ required: true, min: 0, default: 0 })
  organization: number;

  constructor(obj: Partial<ProfilesCount> = {}) {
    this.user = obj.user ?? 0;
    this.group = obj.group ?? 0;
    this.organization = obj.organization ?? 0;
  }
}

const ProfilesCountSchema = SchemaFactory.createForClass(ProfilesCount);

export type UserDocument = User & mongoose.Document;

@Schema({ _id: false })
export class UserEmail implements PropertiesOf<UserEmailModel> {
  @Prop({ required: true, validate: { validator: validateEmail } })
  email: string;

  @Prop({ required: true, validate: { validator: validateEmail } })
  lowercaseEmail: string;

  @Prop({ type: Boolean })
  verified: boolean;

  constructor(email: string, verified = false) {
    this.email = email;
    this.lowercaseEmail = email.toLowerCase();
    this.verified = verified;
  }
}

const UserEmailSchema = SchemaFactory.createForClass(UserEmail);

@Schema({ timestamps: true })
export class User extends BaseEntity<User> implements PropertiesOf<UserModel> {
  @Prop({
    unique: true,
    required: true,
    validate: { validator: validateEmail },
  })
  email: string;

  /**
   * The main email address of the user used for authentication and default email address.
   * Note: This email address is saved in lower case, the original email is available in the emails array.
   */
  @Prop({ type: [UserEmailSchema], required: true })
  @PropertyType([UserEmail])
  emails: UserEmail[];

  @Prop({ default: true })
  enabled: boolean;

  @Length(2, 40)
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  lowercaseUsername: string;

  @Prop({ type: String })
  imageHash: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  lastSeenAt: Date;

  @Prop({ default: getDefaultLocale() })
  locale: string;

  @Prop({ type: [RefreshTokenSchema], default: [] })
  refreshTokens: RefreshToken[];

  @PropertyType(Number, { default: UserStatus.Disabled })
  @Prop({ enum: getNumberEnumValues(UserStatus), required: true })
  status: UserStatus;

  @PropertyType(ProfilesCount, { default: () => new ProfilesCount() })
  @Prop({ type: ProfilesCountSchema, required: true })
  profilesCount: ProfilesCount;

  createdAt: Date;
  updatedAt: Date;

  afterInit() {
    if (this.email && !this.getUserEmail(this.email)) {
      this.emails.push(new UserEmail(this.email));
    }
    this.email = this.email?.toLowerCase();
  }

  getUserEmail(email: string) {
    return this.emails.find((userEmail) => userEmail.lowercaseEmail === email.toLowerCase());
  }

  getVerifiedUserEmail(email: string) {
    return this.emails.find((userEmail) => userEmail.verified && userEmail.lowercaseEmail === email.toLowerCase());
  }

  getUnverifiedUserEmail(email: string) {
    return this.emails.find((userEmail) => !userEmail.verified && userEmail.lowercaseEmail === email.toLowerCase());
  }

  getUnverifiedUserEmails() {
    return this.emails.find((userEmail) => !userEmail.verified);
  }

  getVerifiedUserEmails() {
    return this.emails.find((userEmail) => userEmail.verified);
  }

  isAcitve() {
    return this.hasStatus(UserStatus.Active);
  }

  hasStatus(status: UserStatus) {
    return this.status === status;
  }

  getDisplayName() {
    return this.username;
  }

  getImageHash() {
    if (!this.imageHash && this.email) {
      this.imageHash = crypto.createHash('sha256').update(this.email).digest('hex');
    }

    return this.imageHash;
  }

  getRefreshTokenByVisitorId(vid: string): RefreshToken | undefined {
    if (!vid) {
      return undefined;
    }

    return this.refreshTokens?.find((token) => token.vid === vid);
  }

  getLocale() {
    if (!this.locale) {
      this.locale = getDefaultLocale();
    }

    return this.locale;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.method('toJSON', function () {
  const userDoc = <UserDocument>this;
  const user = <PropertiesOf<User>>userDoc.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
});

// NOTE: Arrow functions are not used here as we do not want to use lexical scope for 'this'
UserSchema.pre('validate', function (next) {
  const user = <UserDocument>this;

  this.email = this.email?.toLowerCase();
  this.lowercaseUsername = this.username.toLowerCase();

  // Make sure not to rehash the password if it is already hashed
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt and use it to hash the user's password
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const updateFields = this.getUpdate() as UpdateQuery<User>;

  if (updateFields.username) {
    this.update({}, { $set: { lowercaseUsername: updateFields.username.toLowerCase() } });
  }

  // Generate a salt and use it to hash the user's password
  if (updateFields.password) {
    bcrypt.hash(updateFields.password, 10, (err, hash) => {
      if (err) return next(err);
      updateFields.password = hash;
      next(null);
    });
  } else {
    next(null);
  }
});

export function getDefaultLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale;
  //return process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE;
}
