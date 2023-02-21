import { Content } from '../schemas';
import { assureObjectId, EntityIdentity, UpdateQuerySet } from '@/core';
import { BaseProfileModelDao } from '@/profiles';
import { User } from '@/users';
import { UpdateQuery } from 'mongoose';
import { SortResult } from '@lyvely/common';

export abstract class AbstractContentDao<T extends Content> extends BaseProfileModelDao<T> {
  protected getModelType(): string | null {
    return 'content';
  }

  async archive(user: User, content: T): Promise<boolean> {
    return this.updateOneByProfileAndIdSet(
      content,
      content,
      this.createUserUpdateQuerySet(user, {
        'meta.isArchived': true,
      }),
    );
  }

  async unarchive(user: User, content: T): Promise<boolean> {
    return this.updateOneByProfileAndIdSet(
      content,
      content,
      this.createUserUpdateQuerySet(user, {
        'meta.isArchived': false,
      }),
    );
  }

  /**
   * Updates the sortOrder by array index
   * @param models
   */
  async updateSortOrder(models: T[]): Promise<SortResult[]> {
    const updates: { id: EntityIdentity<T>; update: UpdateQuerySet<T> }[] = [];
    const result: { id: string; sortOrder: number }[] = [];

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
