import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/users.schema';
import { AbstractDao } from '../../db/abstract.dao';
import { RefreshToken } from '../schemas/refresh.tokens.schema';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import { Constructor } from 'lyvely-common';

@Injectable()
export class UserDao extends AbstractDao<User> {
  constructor(@InjectModel(User.name) protected model: Model<UserDocument>) {
    super();
  }

  async findByUsername(username: string): Promise<User|null> {
    return this.findOne({ lowercaseUsername: username.toLowerCase() });
  }

  async createRefreshToken(identity: EntityIdentity<User>, token: RefreshToken) {
    this.updateOneById(identity, {  })
    return !!(await this.updateOneById(identity,
      { "$push":
          {
            'refreshTokens': new RefreshToken({
              'vid': token.vid,
              'hash': token.hash,
              'expiration': token.expiration
            })
          }
      }
    ));
  }

  async updateRefreshToken(identity: EntityIdentity<User>, token: RefreshToken): Promise<boolean> {
    return !!(await this.model.updateOne(
      { "_id": assureObjectId(identity), "refreshTokens.vid": token.vid },
      { "$set": {
        "refreshTokens.$.hash": token.hash,
        "refreshTokens.$.expiration": token.expiration
      } }
    )).modifiedCount;
  }

  async destroyRefreshToken(identity: EntityIdentity<User>, visitorId: string) {
    return this.model.findByIdAndUpdate(assureObjectId(identity), {
      '$pull': {
        'refreshTokens': { 'vid': visitorId }
      }
    });
  }

  getModelConstructor(): Constructor<User> {
    return User;
  }

  getModuleId(): string {
    return 'users';
  }
}
