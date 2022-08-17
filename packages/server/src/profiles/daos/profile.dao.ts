import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, DEFAULT_PROFILE_NAME, ProfileDocument } from '../schemas';
import { Model } from 'mongoose';
import { assureObjectId, EntityData, EntityIdentity } from '../../db/db.utils';
import { User } from '../../users';
import { AbstractDao } from '../../db/abstract.dao';
import { Constructor } from '@lyvely/common';
import { Tag } from "../../categories/schemas/categories.schema";

type UpsertProfile = { createdBy: EntityIdentity<User> } & Partial<EntityData<Profile>>;

@Injectable()
export class ProfileDao extends AbstractDao<Profile> {
  @InjectModel(Profile.name) protected model: Model<ProfileDocument>;

  async upsert(insert: UpsertProfile): Promise<Profile> {
    insert.name = insert.name || DEFAULT_PROFILE_NAME;
    return this.model
      .findOneAndUpdate(
        { createdBy: assureObjectId<User>(insert.createdBy), name: insert.name },
        { $setOnInsert: insert },
        { upsert: true, new: true },
      )
      .exec();
  }

  async addCategories(profile: Profile, categories: Tag[]) {
    return this.updateOneById(profile, { $push: { categories: { $each: categories } } })
  }

  async updateScore(identity: EntityIdentity<Profile>, newScore) {
    if(typeof newScore !== 'number') {
      return;
    }
    return this.updateOneSetById(identity, { score: Math.max(newScore, 0) });
  }

  getModuleId(): string {
    return 'profiles';
  }

  getModelConstructor(): Constructor<Profile> {
    return Profile;
  }
}
