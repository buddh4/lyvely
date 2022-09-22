import { Injectable } from '@nestjs/common';
import { Tag } from '../../tags';
import { assureObjectId, EntityIdentity } from '../../core/db/db.utils';
import { ProfileDao } from '../daos';
import { Profile } from '../schemas';
import { EntityValidationException } from "../../core/exceptions";

@Injectable()
export class ProfileTagsService {
  constructor(
    public profileDao: ProfileDao,
  ) {}

  async mergeTags(profile: Profile, tagsNames?: string[]): Promise<Profile> {
    if (!tagsNames || !tagsNames.length) {
      return profile;
    }

    const newTagNames = new Set<string>();
    const tagsToPush = [];

    tagsNames.forEach((tagName) => {
      if(!tagName.length || newTagNames.has(tagName)) {
        return;
      }

      if(!profile.tags.find((tag) => tag.name === tagName)) {
        newTagNames.add(tagName);
        tagsToPush.push(Tag.create({ name: tagName }));
      }
    });

    await this.profileDao.addTags(profile, tagsToPush);

    return profile;
  }

  async addTag(profile: Profile, data: Partial<Tag>) {
    const tag = profile.getTagByName(data.name);

    if(tag) {
      throw new EntityValidationException('A tag with the same name already exists');
    }

    return !!await this.profileDao.addTags(profile, [Tag.create(data)]);
  }

  async updateTag(profile: Profile, identity: EntityIdentity<Tag>, update: Partial<Tag>) {
    const tag = profile.getTagById(assureObjectId(identity));

    if(!tag) return false;

    return !!await this.profileDao.updateTag(profile, identity, update);
  }

  async archiveTag(profile: Profile, identity: EntityIdentity<Tag>) {
    return this.updateTag(profile, identity, { archived: true })
  }

  async unArchiveTag(profile: Profile, identity: EntityIdentity<Tag>) {
    return this.updateTag(profile, identity, { archived: false })
  }
}
