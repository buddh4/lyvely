import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import mongoose, { UpdateQuery } from 'mongoose';
import { BaseEntity } from '../../db/base.entity';
import { Length } from 'class-validator';
import { RefreshToken, RefreshTokenSchema } from './refresh.tokens.schema';
import crypto from 'crypto';
import {UserDto} from "lyvely-common";

export type UserDocument = User & mongoose.Document;

@Exclude()
@Schema({ timestamps: true })
export class User extends BaseEntity<User> {
  @Prop({
    unique: true,
    required: true,
    validate: { validator: validateEmail },
  })
  email: string;

  @Length(2, 40)
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  imageHash: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  lowercaseUsername: string;

  @Prop({ required: true, unique: true })
  lowercaseEmail: string;

  @Prop({ default: true })
  enabled: boolean;

  @Prop({ default: Date.now })
  lastSeenAt: Date;

  @Prop({ default: getDefaultLocale() })
  locale: string;

  @Prop( { type: [RefreshTokenSchema], default: [] } )
  refreshTokens: RefreshToken[];

  getDisplayName() {
    return this.username;
  }

  getImageHash() {
    if(!this.imageHash && this.lowercaseEmail) {
      this.imageHash = crypto.createHash('sha256').update(this.lowercaseEmail).digest('hex');
    }

    return this.imageHash;
  }

  getRefreshTokenByVisitorId(vid: string): RefreshToken | undefined {
    if(!vid) {
      return undefined;
    }

    return this.refreshTokens?.find(token => token.vid === vid);
  }

  async validatePassword(password: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (error, isMatch) => {
        if (error) {
          reject(error);
        }

        resolve(isMatch);
      });
    });
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
  const user = userDoc.toObject();
  delete user.password;
  return user;
});

// NOTE: Arrow functions are not used here as we do not want to use lexical scope for 'this'
UserSchema.pre('validate', function (next) {
  const user = <UserDocument>this;

  user.lowercaseUsername = user.username.toLowerCase();
  user.lowercaseEmail = user.email.toLowerCase();

  // Make sure not to rehash the password if it is already hashed
  if (!user.isModified('password')) {
    return next();
  }

  // Generate a salt and use it to hash the user's password
  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return next(genSaltError);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const updateFields = this.getUpdate() as UpdateQuery<User>;

  if (updateFields.username) {
    this.update(
      {},
      { $set: { lowercaseUsername: updateFields.username.toLowerCase() } },
    );
  }

  if (updateFields.email) {
    this.update(
      {},
      { $set: { lowercaseEmail: updateFields.email.toLowerCase() } },
    );
  }

  // Generate a salt and use it to hash the user's password
  if (updateFields.password) {
    bcrypt.genSalt(10, (genSaltError, salt) => {
      if (genSaltError) {
        return next(genSaltError);
      }

      bcrypt.hash(updateFields.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        updateFields.password = hash;
        next(null);
      });
    });
  } else {
    next(null);
  }
});

UserSchema.methods.getLocale = function (): string {
  const user = <UserDocument>this;

  if (!user.locale) {
    user.locale = getDefaultLocale();
  }

  return user.locale;
};

export function getDefaultLocale() {
  return Intl.DateTimeFormat().resolvedOptions().locale;
  //return process.env.LC_ALL || process.env.LC_MESSAGES || process.env.LANG || process.env.LANGUAGE;
}

// Mongoose Static Method - added so a service can validate an email with the same criteria the schema is using
UserSchema.statics.validateEmail = function (email: string): boolean {
  return validateEmail(email);
};

function validateEmail(email: string) {
  // tslint:disable-next-line:max-line-length
  const expression = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return expression.test(email);
}
