import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { UpdateQuery, Document } from 'mongoose';
import {
  BaseDocument,
  type BaseDocumentData,
  createObjectId,
  getDefaultLocale,
  MixedProp,
  TObjectId,
} from '@/core';
import {
  PropertiesOf,
  getNumberEnumValues,
  PropertyType,
  validateEmail,
  getStringEnumValues,
} from '@lyvely/common';
import { RefreshToken, RefreshTokenSchema } from './refresh.tokens.schema';
import { createHash } from 'crypto';
import {
  UserModel,
  UserStatus,
  VALID_HANDLE_REGEX,
  VALID_DISPLAY_NAME_REGEX,
  IPermissionObject,
  UserRelationRole,
  GlobalPermissionRole,
  IUserRelationPermissionSetting,
} from '@lyvely/interface';
import { Avatar, AvatarSchema } from '@/avatars/schemas';
import { UserEmail, UserEmailSchema } from './user-email.schema';
import { ProfilesCount, ProfilesCountSchema } from './profiles-count.schema';
import {
  UserNotificationState,
  UserNotificationStateSchema,
} from './user-notification-state.schema';
import {
  UserRolePermission,
  UserRolePermissionSchema,
} from '@/users/schemas/user-permissions.schema';
import { UserRelationGroup, UserRelationGroupSchema } from './user-relation-group.schema';

/**
 * This class defines the user schema of user documents.
 */
@Schema({ timestamps: true })
export class User
  implements PropertiesOf<UserModel<TObjectId>>, IPermissionObject<UserRelationRole>
{
  /** The main email of this user. **/
  @Prop({
    unique: true,
    required: true,
    validate: { validator: validateEmail },
  })
  email: string;

  /** The guid of this user used in the frontend. **/
  @Prop({ unique: true })
  guid: string;

  /** The avatar model of this user. **/
  @Prop({ type: AvatarSchema })
  avatar?: Avatar;

  /**
   * Contains all emails registered by this user.
   * User emails should only be actively used once confirmed.
   */
  @Prop({ type: [UserEmailSchema], required: true })
  @PropertyType([UserEmail])
  emails: UserEmail[];

  /** The unique username of this user. **/
  @Prop({ required: true, validate: VALID_HANDLE_REGEX })
  username: string;

  /** The non-unique display name of this user. **/
  @Prop({ required: true, validate: VALID_DISPLAY_NAME_REGEX })
  displayName: string;

  /** The hashed password of this user. **/
  @Prop({ required: true })
  password: string;

  // TODO: Proper validation.
  /** The locale of this user used for translation and default locale related formats. **/
  @Prop({ default: getDefaultLocale() })
  locale: string;

  @Prop()
  timezone: string;

  /** Module and other settings. **/
  @MixedProp({ default: {} })
  settings: Record<string, any>;

  /** Known refresh tokens of this user. **/
  @Prop({ type: [RefreshTokenSchema], default: [] })
  refreshTokens: RefreshToken[];

  /** The status of this user. **/
  @PropertyType(Number, { default: UserStatus.Disabled })
  @Prop({ enum: getNumberEnumValues(UserStatus), required: true })
  status: UserStatus;

  /** Represents the global permission role. **/
  @Prop({
    required: true,
    enum: getStringEnumValues(GlobalPermissionRole),
    default: GlobalPermissionRole.User,
  })
  @PropertyType(String, { default: GlobalPermissionRole.User })
  role: GlobalPermissionRole;

  /** Keeps track of profile membership counts by profile type. **/
  @PropertyType(ProfilesCount, { default: () => new ProfilesCount() })
  @Prop({ type: ProfilesCountSchema, required: true })
  profilesCount: ProfilesCount;

  /** Can be used to reset all active tokens. **/
  @Prop({ type: Date })
  sessionResetAt?: Date;

  /** Keeps track of the date of the latest password reset. **/
  @Prop({ type: Date })
  passwordResetAt?: Date;

  /** Used for balanced notifications in order to not annoy users. **/
  @Prop({ type: UserNotificationStateSchema })
  @PropertyType(UserNotificationState)
  notification: UserNotificationState;

  /** User relation role permission settings. **/
  @Prop({ type: [UserRolePermissionSchema], default: [] })
  @PropertyType([UserRolePermission])
  permissions: UserRolePermission[];

  @Prop({ type: [UserRelationGroupSchema], default: [] })
  @PropertyType([UserRelationGroup])
  groups: UserRelationGroup[];

  id: string;
  _id: TObjectId;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: BaseDocumentData<User>) {
    BaseDocument.init(this, data);
  }

  /**
   * Hook, which runs after initialization. used for certain defaults as:
   *
   * - Pushes the main email to the emails array, if it does not exist.
   * - Creates a guid
   */
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

    this.settings ||= {};

    if (!this.locale) {
      this.locale = getDefaultLocale();
    }
  }

  /**
   * Retrieves the permission settings.
   * This function is part of the IPermissionObject interface.
   *
   * @return {IUserRelationPermissionSetting[]} The array of permission settings.
   */
  getPermissionSettings(): IUserRelationPermissionSetting[] {
    return (
      this.permissions?.map((p) => ({ ...p, groups: p.groups?.map((g) => g.toString()) })) || []
    );
  }

  /**
   * Retrieves an array of permission groups.
   * This function is part of the IPermissionObject interface.
   *
   * @returns {string[]} The array of permission groups' IDs.
   */
  getPermissionGroups(): string[] {
    return this.groups.map((g) => g.id);
  }

  /**
   * Returns a UserEmail instance if the given email is connected with this user in a case-insensitive manner.
   * @param email the email.
   */
  getUserEmail(email: string) {
    return this.emails.find((userEmail) => userEmail.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Returns a UserEmail instance if the given email is connected and verified by this user in a case-insensitive manner.
   * @param email the email.
   */
  getVerifiedUserEmail(email: string) {
    return this.emails.find(
      (userEmail) => userEmail.verified && userEmail.email.toLowerCase() === email.toLowerCase(),
    );
  }

  /**
   * Returns a UserEmail instance if the given email is connected and not yet verified by this user in a case-insensitive manner.
   * @param email the email.
   */
  getUnverifiedUserEmail(email: string) {
    return this.emails.find(
      (userEmail) => !userEmail.verified && userEmail.email.toLowerCase() === email.toLowerCase(),
    );
  }

  /**
   * Returns all UserEmail instances of unverified emails connected to this user.
   */
  getUnverifiedUserEmails() {
    return this.emails.filter((userEmail) => !userEmail.verified);
  }

  /**
   * Returns all UserEmail instances of verified emails connected to this user.
   */
  getVerifiedUserEmails() {
    return this.emails.filter((userEmail) => userEmail.verified);
  }

  /**
   * Checks if this user has an active state.
   */
  isAcitve() {
    return this.hasStatus(UserStatus.Active);
  }

  /**
   * Checks if this user has a specific state.
   * @param status The state to check against.
   */
  hasStatus(status: UserStatus) {
    return this.status === status;
  }

  /**
   * Returns the display name of this user.
   */
  getDisplayName() {
    return this.displayName;
  }

  /**
   * Returns a refresh token connected with the given visitor-id.
   * @param vid The visitor-id to search for.
   */
  getRefreshTokenByVisitorId(vid: string): RefreshToken | undefined {
    if (!vid) {
      return undefined;
    }

    return this.refreshTokens?.find((token) => token.vid === vid);
  }

  /**
   * Returns the locale of this user or a default locale in case no locale was set.
   */
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

// Make sure we hash the password in case it is part of an findOneAndUpdate query.
UserSchema.pre('findOneAndUpdate', function (next) {
  preUpdateQuery(this.getUpdate() as UpdateQuery<User>, next);
});

// Make sure we hash the password in case it is part of an findOneAndReplace query.
UserSchema.pre('findOneAndReplace', function (next) {
  preUpdateQuery(this.getUpdate() as UpdateQuery<User>, next);
});

// Make sure we hash the password in case it is part of an updateOne query.
UserSchema.pre('updateOne', function (next) {
  preUpdateQuery((<UpdateQuery<User>>this).getUpdate(), next);
});

// Make sure we hash the password in case it is part of an replaceOne query.
UserSchema.pre('replaceOne', function (next) {
  preUpdateQuery((<UpdateQuery<User>>this).getUpdate(), next);
});

// We do not support multi password updates, so we remove it from any updateMany query.
UserSchema.pre('updateMany', function (next) {
  const update = (<UpdateQuery<User>>this).getUpdate();
  if (update.password) delete update.password;
  if (update.$set.password) delete update.$set.password;
  next();
});

/**
 * Assure we hash passwords if part of an update query.
 * @param update The update query.
 * @param next Mongoose next hook.
 */
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

/**
 * Assure we hash passwords if part of a document update.
 * @param update The document to update.
 * @param next Mongoose next hook.
 */
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

UserSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: 'en', strength: 1 }, name: 'UniqueUsernameIndex' },
);

UserSchema.index(
  { 'emails.email': 1 },
  { collation: { locale: 'en', strength: 1 }, name: 'UserEmailIndex' },
);
