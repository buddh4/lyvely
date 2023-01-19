import { Content } from '../schemas';
import { assureObjectId, EntityIdentity, UpdateQuerySet } from '@/core';
import { BaseProfileModelDao } from '@/profiles';
import { User } from '@/users';
import { UpdateQuery } from 'mongoose';

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
