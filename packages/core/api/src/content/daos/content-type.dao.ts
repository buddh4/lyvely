import { Content } from '../schemas';
import { assureObjectId, EntityIdentity, UpdateQuerySet, UpdateQuery } from '@/core';
import { BaseProfileModelDao, Profile } from '@/profiles';
import { User } from '@/users';
import { SortResult } from '@lyvely/common';

export abstract class ContentTypeDao<T extends Content> extends BaseProfileModelDao<T> {
  protected getModelType(): string | null {
    return 'content';
  }

  async archive(user: User, content: T): Promise<boolean> {
    return this.updateOneByProfileAndIdSet(
      content,
      content,
      this.createUserUpdateQuerySet(user, {
        'meta.archived': true,
      }),
    );
  }

  async restore(user: User, content: T): Promise<boolean> {
    return this.updateOneByProfileAndIdSet(
      content,
      content,
      this.createUserUpdateQuerySet(user, {
        'meta.archived': false,
        'meta.deleted': false,
      }),
    );
  }

  /**
   * Updates the sortOrder by array index
   * @param models
   */
  async updateSortOrder(models: T[]): Promise<SortResult[]> {
    const updates: { id: EntityIdentity<T>; update: UpdateQuerySet<T> }[] = [];
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
      { sort: <any>{ 'meta.sortOrder': -1 }, limit: 1 },
    );
    return !maxSortOrderEntry.length || typeof maxSortOrderEntry[0].meta.sortOrder !== 'number'
      ? 0
      : maxSortOrderEntry[0].meta.sortOrder + 1;
  }

  createUserUpdateQuery(
    user: EntityIdentity<User>,
    update?: UpdateQuery<Content>,
  ): UpdateQuery<Content> {
    if (!update) update = {};
    if (!update['$set']) update['$set'] = {};
    update['$set']['meta.updatedBy'] = assureObjectId(user);
    update['$set']['meta.updatedAt'] = new Date();
    return update;
  }

  createUserUpdateQuerySet(
    user: EntityIdentity<User>,
    update?: UpdateQuerySet<Content>,
  ): UpdateQuerySet<Content> {
    if (!update) update = {};
    update['meta.updatedBy'] = assureObjectId(user);
    update['meta.updatedAt'] = new Date();
    return update;
  }
}
