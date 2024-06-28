import {
  getProfileConstructorByType,
  GroupProfile,
  Organization,
  Profile,
  Tag,
  UserProfile,
} from '../schemas';
import {
  AbstractDao,
  assureObjectId,
  createObjectId,
  Dao,
  DocumentIdentity,
  IBaseFetchQueryOptions,
  IFetchQueryOptions,
} from '@/core';
import { User } from '@/users';
import { assignRawDataTo } from '@lyvely/common';
import { ProfileType, ProfileVisibilityLevel } from '@lyvely/interface';
import { ProfileTypeTransformation } from '../schemas/transformations';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(Profile, {
  discriminator: (doc) => getProfileConstructorByType(doc.type),
  isolation: TenancyIsolation.Profile,
})
export class ProfilesDao extends AbstractDao<Profile> {
  constructor() {
    super();
    this.registerTransformations(new ProfileTypeTransformation());
  }

  async findOneByOwnerAndName(owner: DocumentIdentity<User>, name: string) {
    return this.findOne({ ownerId: assureObjectId(owner), name });
  }

  async findOneByOrganizationAndName(organization: DocumentIdentity<Organization>, name: string) {
    return this.findOne({ oid: assureObjectId(organization), name });
  }

  async findOrganizationByName(name: string) {
    return this.findOne({ type: ProfileType.Organization, name });
  }

  /**
   * This function searches for a profile which meets any of the following conditions:
   *
   * - A profile with the given owner and name.
   * - Any organization with the given name.
   *
   * This is usually used to check in case an organization name is available.
   * @param owner
   * @param name
   */
  async findExistingProfileByOrganizationName(owner: DocumentIdentity<User>, name: string) {
    return this.findOne({
      $or: [
        { ownerId: assureObjectId(owner), name },
        { type: ProfileType.Organization, name },
      ],
    });
  }

  /**
   * Finds an entity by given Identity and type.
   * Returns the entity with the search id and type or null if no entity with the given identity was found.
   * @param identity
   * @param options
   */
  async findByTypeAndId(
    identity: DocumentIdentity<Profile>,
    type: ProfileType.User,
    options?: IBaseFetchQueryOptions<Profile>
  ): Promise<UserProfile>;
  async findByTypeAndId(
    identity: DocumentIdentity<Profile>,
    type: ProfileType.Group,
    options?: IBaseFetchQueryOptions<Profile>
  ): Promise<GroupProfile>;
  async findByTypeAndId(
    identity: DocumentIdentity<Profile>,
    type: ProfileType.Organization,
    options?: IBaseFetchQueryOptions<Profile>
  ): Promise<Organization>;
  async findByTypeAndId(
    identity: DocumentIdentity<Profile>,
    type: ProfileType,
    options?: IBaseFetchQueryOptions<Profile>
  ): Promise<Profile | null> {
    return this.findByIdAndFilter(identity, { type }, options);
  }

  async findByTypeAndHandle(
    handle: string,
    type: ProfileType,
    options?: IBaseFetchQueryOptions<Profile>
  ): Promise<Profile | null> {
    return this.findOne({ type, handle }, options);
  }

  async findByHandle(
    handle: string,
    options?: IBaseFetchQueryOptions<Profile>
  ): Promise<Profile | null> {
    return this.findOne({ handle }, options);
  }

  async findByHandles(
    handles: string[],
    options?: IFetchQueryOptions<Profile>
  ): Promise<Profile[]> {
    if (!handles.length) return [];
    return this.findAll({ handle: { $in: handles } }, options);
  }

  async findByVisibility(
    visibility: ProfileVisibilityLevel,
    options?: IFetchQueryOptions<Profile>
  ): Promise<Profile[]> {
    return this.findAll({ visibility: { $gte: visibility } }, options);
  }

  async addTags(profile: Profile, tags: Tag[]) {
    tags.forEach((tag) => {
      tag._id = tag._id || createObjectId();
    });
    return this.updateOneById(profile, { $push: { tags: { $each: tags } } });
  }

  async updateTag(profile: Profile, identity: DocumentIdentity<Tag>, update: Partial<Tag>) {
    const tag = profile.getTagById(assureObjectId(identity));

    if (!tag) return 0;

    assignRawDataTo(tag, update);

    return this.updateOneByFilter(
      profile,
      { $set: { 'tags.$[tag]': tag } },
      {},
      {
        arrayFilters: [{ 'tag._id': assureObjectId(identity) }],
      }
    );
  }

  async updateScore(identity: DocumentIdentity<Profile>, newScore) {
    if (typeof newScore !== 'number') {
      return;
    }
    return this.updateOneSetById(identity, { score: Math.max(newScore, 0) });
  }
}
