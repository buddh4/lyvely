import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, Profile, getProfileConstructorByType, Tag } from '../schemas';
import mongoose, { Model } from 'mongoose';
import { applyRawDataTo, assureObjectId, EntityIdentity, AbstractDao } from '@lyvely/core';
import { User } from '@lyvely/users';
import { Constructor, DeepPartial, IntegrityException } from '@lyvely/common';
import { ProfileType } from '@lyvely/profiles-interface';

@Injectable()
export class ProfileDao extends AbstractDao<Profile> {
  @InjectModel(Profile.name) protected model: Model<Profile>;

  async findOneByOwnerAndName(owner: EntityIdentity<User>, name: string) {
    return this.findOne({ ownerId: assureObjectId(owner), name });
  }

  async findOneByOrganizationAndName(organization: EntityIdentity<Organization>, name: string) {
    return this.findOne({ oid: assureObjectId(organization), name });
  }

  async findOrganizationByName(name: string) {
    return this.findOne({ type: ProfileType.Organization, name });
  }

  async findOneByOwnerOrOrganizationName(owner: EntityIdentity<User>, name: string) {
    return this.findOne({
      $or: [
        { ownerId: assureObjectId(owner), name },
        { type: ProfileType.Organization, name },
      ],
    });
  }

  async addTags(profile: Profile, tags: Tag[]) {
    tags.forEach((tag) => {
      tag._id = tag._id || new mongoose.Types.ObjectId();
    });
    return this.updateOneById(profile, { $push: { tags: { $each: tags } } });
  }

  async updateTag(profile: Profile, identity: EntityIdentity<Tag>, update: Partial<Tag>) {
    const tag = profile.getTagById(assureObjectId(identity));

    if (!tag) return 0;

    applyRawDataTo(tag, update, { strict: false });

    return this.updateOneByFilter(
      profile,
      { $set: { 'tags.$[tag]': tag } },
      {},
      {
        arrayFilters: [{ 'tag._id': assureObjectId(identity) }],
      },
    );
  }

  async updateScore(identity: EntityIdentity<Profile>, newScore) {
    if (typeof newScore !== 'number') {
      return;
    }
    return this.updateOneSetById(identity, { score: Math.max(newScore, 0) });
  }

  getModuleId(): string {
    return 'profiles';
  }

  getModelConstructor(model: DeepPartial<Profile>): Constructor<Profile> {
    const ProfileType = getProfileConstructorByType(model.type);
    if (!ProfileType) {
      throw new IntegrityException(
        'Could not construct profile model due to invalid type: ' + model.type,
      );
    }
    return ProfileType;
  }
}
