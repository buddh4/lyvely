import { buildContentFilterQuery, Content } from '../schemas';
import { assureObjectId, DocumentIdentity, UpdateQuerySet, UpdateQuery } from '@/core';
import { ProfileShardDao, Profile, type ProfileShardData } from '@/profiles';
import { User } from '@/users';
import { SortResult } from '@lyvely/interface';
import { IContentSearchFilter } from '@/content';

/**
 * An abstract class representing a DAO (Data Access Object) for ContentTypes.
 * The ContentTypeDao is used to query or update specific content types.
 *
 * @template T - The type of the Content.
 * @template TVersions - The type of the Versions.
 */
export abstract class ContentTypeDao<
  T extends Content,
  TVersions extends Content = T,
> extends ProfileShardDao<T, TVersions> {
  protected override getModelType(): string | null {
    return 'content';
  }

  /**
   * Finds all documents based on the given filter.
   *
   * @param profileRelation
   * @param {IContentSearchFilter} filter - The filter object used to search for items.
   * @return {Promise<T>} - A promise that will resolve to the array of filtered items.
   */
  async findAllByFilter(
    profileRelation: ProfileShardData,
    filter?: IContentSearchFilter
  ): Promise<T[]> {
    return this.findAllByProfile(profileRelation, buildContentFilterQuery(filter) || {});
  }

  /**
   * Finds a single documents based on the given filter.
   *
   * @param profileRelation
   * @param {IContentSearchFilter} filter - The filter object used to search for items.
   * @return {Promise<T>} - A promise that will resolve to the array of filtered items.
   */
  async findOneByFilter(
    profileRelation: ProfileShardData,
    filter?: IContentSearchFilter
  ): Promise<T | null> {
    return this.findOneByProfile(profileRelation, buildContentFilterQuery(filter) || {});
  }

  /**
   *
   * @param user
   * @param content
   */
  async archive(user: User, content: T): Promise<boolean> {
    return this.updateOneByProfileAndIdSet(
      content,
      content,
      this.createUserUpdateQuerySet(user, {
        'meta.archived': true,
      })
    );
  }

  async restore(user: User, content: T): Promise<boolean> {
    return this.updateOneByProfileAndIdSet(
      content,
      content,
      this.createUserUpdateQuerySet(user, {
        'meta.archived': false,
        'meta.deleted': false,
      })
    );
  }

  /**
   * Updates the sortOrder by array index
   * @param models
   */
  async updateSortOrder(models: T[]): Promise<SortResult[]> {
    const updates: { id: DocumentIdentity<T>; update: UpdateQuerySet<T> }[] = [];
    const result: SortResult[] = [];

    models.forEach((model, index) => {
      if (model.meta.sortOrder !== index) {
        updates.push({ id: model._id, update: { 'meta.sortOrder': index } });
        model.meta.sortOrder = index;
        result.push(new SortResult({ id: model.id, sortOrder: index }));
      }
    });

    await this.updateSetBulk(updates);
    return result;
  }

  async getNextSortOrder(profile: Profile) {
    const maxSortOrderEntry = await this.findAllByProfile(
      profile,
      {},
      { sort: <any>{ 'meta.sortOrder': -1 }, limit: 1 }
    );
    return !maxSortOrderEntry.length || typeof maxSortOrderEntry[0].meta.sortOrder !== 'number'
      ? 0
      : maxSortOrderEntry[0].meta.sortOrder + 1;
  }

  createUserUpdateQuery(
    user: DocumentIdentity<User>,
    update?: UpdateQuery<Content>
  ): UpdateQuery<Content> {
    if (!update) update = {};
    if (!update['$set']) update['$set'] = {};
    update['$set']['meta.updatedBy'] = assureObjectId(user);
    update['$set']['meta.updatedAt'] = new Date();
    return update;
  }

  createUserUpdateQuerySet(
    user: DocumentIdentity<User>,
    update?: UpdateQuerySet<Content>
  ): UpdateQuerySet<Content> {
    if (!update) update = {};
    update['meta.updatedBy'] = assureObjectId(user);
    update['meta.updatedAt'] = new Date();
    return update;
  }
}
