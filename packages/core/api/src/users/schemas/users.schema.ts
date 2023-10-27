import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { UpdateQuery, Document } from 'mongoose';
import { BaseEntity, createObjectId, getDefaultLocale } from '@/core';
import { PropertiesOf, getNumberEnumValues, PropertyType, validateEmail } from '@lyvely/common';
import { RefreshToken, RefreshTokenSchema } from './refresh.tokens.schema';
import { createHash } from 'crypto';
import { USER_DISPLAY_NAME_REGEX, UserModel, UserStatus } from '@lyvely/core-interface';
import { Avatar, AvatarSchema } from '@/avatars';
import { UserEmail, UserEmailSchema } from './user-email.schema';
import { ProfilesCount, ProfilesCountSchema } from './profiles-count.schema';
import {
  UserNotificationState,
  UserNotificationStateSchema,
} from './user-notification-state.schema';

@Schema({ timestamps: true })
export class User extends BaseEntity<User> implements PropertiesOf<UserModel> {
  @Prop({
    unique: true,
    required: true,
    validate: { validator: validateEmail },
  })
  email: string;

  @Prop()
  guid: string;

  @Prop({ type: AvatarSchema })
  //@PropertyType(Avatar, { default: undefined })
  avatar?: Avatar;

  /**
   * The main email address of the user used for authentication and default email address.
   * Note: This email address is saved in lower case, the original email is available in the emails array.
   */
  @Prop({ type: [UserEmailSchema], required: true })
  @PropertyType([UserEmail])
  emails: UserEmail[];

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, validate: USER_DISPLAY_NAME_REGEX })
  displayName: string;

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

  @Prop({ type: Date })
  sessionResetAt?: Date;

  @Prop({ type: Date })
  passwordResetAt?: Date;

  @Prop({ type: UserNotificationStateSchema })
  @PropertyType(UserNotificationState)
  notification: UserNotificationState;

  createdAt: Date;
  updatedAt: Date;

  afterInit() {
    if (this.email && !this.getUserEmail(this.email)) {
      this.emails.push(new UserEmail(this.email));
    }

    this.email = this.email?.toLowerCase();

    // Patch for prior 0.1.0.alpha4 where displayName did not exist
    if (!this.displayName) {
      this.displayName = this.username;
    }

    if (!this.guid) {
      this.guid = createHash('sha256')
        .update(createObjectId().toString() + this.email)
        .digest('hex');
    }
  }

  getUserEmail(email: string) {
    return this.emails.find((userEmail) => userEmail.email.toLowerCase() === email.toLowerCase());
  }

  getVerifiedUserEmail(email: string) {
    return this.emails.find(
      (userEmail) => userEmail.verified && userEmail.email.toLowerCase() === email.toLowerCase(),
    );
  }

  getUnverifiedUserEmail(email: string) {
    return this.emails.find(
      (userEmail) => !userEmail.verified && userEmail.email.toLowerCase() === email.toLowerCase(),
    );
  }

  getUnverifiedUserEmails() {
    return this.emails.filter((userEmail) => !userEmail.verified);
  }

  getVerifiedUserEmails() {
    return this.emails.filter((userEmail) => userEmail.verified);
  }

  isAcitve() {
    return this.hasStatus(UserStatus.Active);
  }

  hasStatus(status: UserStatus) {
    return this.status === status;
  }

  getDisplayName() {
    return this.displayName;
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
  const userDoc = <User & Document>this;
  const user = <Partial<PropertiesOf<User>>>userDoc.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
});

// NOTE: Arrow functions are not used here as we do not want to use lexical scope for 'this'
UserSchema.pre('validate', function (next) {
  const user = <User & Document>this;

  this.email = this.email?.toLowerCase();

  // Make sure not to rehash the password if it is already hashed
  if (user.isModified('password')) {
    preUpdateModel(user, next);
  } else {
    next();
  }
});

UserSchema.pre('findOneAndUpdate', function (next) {
  preUpdateQuery(this.getUpdate() as UpdateQuery<User>, next);
});

UserSchema.pre('findOneAndReplace', function (next) {
  preUpdateQuery(this.getUpdate() as UpdateQuery<User>, next);
});

UserSchema.pre('updateOne', function (next) {
  preUpdateQuery((<UpdateQuery<User>>this).getUpdate(), next);
});

UserSchema.pre('replaceOne', function (next) {
  preUpdateQuery((<UpdateQuery<User>>this).getUpdate(), next);
});

UserSchema.pre('updateMany', function (next) {
  // Prevent multi password updates
  const update = (<UpdateQuery<User>>this).getUpdate();
  if (update.password) delete update.password;
  if (update.$set.password) delete update.$set.password;
  next();
});

UserSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: 'en', strength: 1 }, name: 'UniqueUsernameIndex' },
);
UserSchema.index(
  { 'emails.email': 1 },
  { collation: { locale: 'en', strength: 1 }, name: 'UserEmailIndex' },
);

function preUpdateQuery(update: UpdateQuery<User>, next) {
  if (update?.password) {
    hash(update.password, 10, (err, hash) => {
      if (err) return next(err);
      update.password = hash;
      next();
    });
  } else if (update?.$set?.password) {
    hash(update?.$set?.password, 10, (err, hash) => {
      if (err) return next(err);
      update.$set!.password = hash;
      next();
    });
  } else {
    next();
  }
}

function preUpdateModel(update: User, next) {
  if (update?.password) {
    hash(update.password, 10, (err, hash) => {
      if (err) return next(err);
      update.password = hash;
      next();
    });
  } else {
    next();
  }
}
