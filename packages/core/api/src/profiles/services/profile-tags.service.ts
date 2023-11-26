import { Injectable } from '@nestjs/common';
import { assureObjectId, EntityIdentity } from '@/core';
import { FieldValidationException } from '@lyvely/common';
import { ProfileDao } from '../daos';
import { Profile, Tag } from '../schemas';

@Injectable()
export class ProfileTagsService {
  constructor(public profileDao: ProfileDao) {}

  async mergeTags(profile: Profile, tagsNames?: string[]): Promise<Profile> {
    if (!tagsNames || !tagsNames.length) {
      return profile;
    }

    const newTagNames = new Set<string>();
    const tagsToPush: Tag[] = [];

    tagsNames.forEach((tagName) => {
      if (!tagName.length || newTagNames.has(tagName)) {
        return;
      }

      if (!profile.tags.find((tag) => tag.name === tagName)) {
        newTagNames.add(tagName);
        tagsToPush.push(Tag.create({ name: tagName }));
      }
    });

    await this.profileDao.addTags(profile, tagsToPush);

    return profile;
  }

  async addTag(profile: Profile, data: Partial<Tag>) {
    const tag = profile.getTagByName(data.name!);

    if (tag) {
      throw new FieldValidationException([{ property: 'name', errors: ['unique'] }]);
    }

    return this.profileDao.addTags(profile, [Tag.create(data)]);
  }

  async updateTag(profile: Profile, identity: EntityIdentity<Tag>, update: Partial<Tag>) {
    const tag = profile.getTagById(assureObjectId(identity));

    if (!tag) return false;

    return !!(await this.profileDao.updateTag(profile, identity, update));
  }

  async archiveTag(profile: Profile, identity: EntityIdentity<Tag>) {
    return this.updateTag(profile, identity, { archived: true });
  }

  async restore(profile: Profile, identity: EntityIdentity<Tag>) {
    return this.updateTag(profile, identity, { archived: false });
  }
}
