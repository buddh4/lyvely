import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '../schemas';
import mongoose, { Model } from 'mongoose';
import { applyRawDataTo, assureObjectId, EntityData, EntityIdentity } from '../../../core/db/db.utils';
import { User } from '../../users';
import { AbstractDao } from '../../../core/db/abstract.dao';
import { Constructor } from '@lyvely/common';
import { Tag } from "../../tags";

type UpsertProfile = { createdBy: EntityIdentity<User> } & Partial<EntityData<Profile>>;

@Injectable()
export class ProfileDao extends AbstractDao<Profile> {
  @InjectModel(Profile.name) protected model: Model<ProfileDocument>;

  async addTags(profile: Profile, tags: Tag[]) {
    tags.forEach(tag => { tag._id = tag._id || new mongoose.Types.ObjectId(); })
    return this.updateOneById(profile, { $push: { tags: { $each: tags } } })
  }

  async updateTag(profile: Profile, identity: EntityIdentity<Tag>, update: Partial<Tag>) {
    const tag = profile.getTagById(assureObjectId(identity));

    if(!tag) {
      return 0;
    }

    applyRawDataTo(tag, update, { strict: false });

    return this.updateOneByFilter(profile, { $set: { 'tags.$[tag]': tag } }, {}, {
      arrayFilters: [ { 'tag._id': assureObjectId(identity) } ]
    })
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
