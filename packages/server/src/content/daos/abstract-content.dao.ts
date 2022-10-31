import { Content } from '../schemas';
import { EntityIdentity, UpdateQuerySet } from '@/core';
import { BaseProfileModelDao, ProfileRelation } from '@/profiles';

export abstract class AbstractContentDao<T extends Content> extends BaseProfileModelDao<T> {
  protected getModelType(): string | null {
    return 'content';
  }

  async archive(profileRelation: ProfileRelation, identity: EntityIdentity<T>): Promise<boolean> {
    const update = { 'meta.isArchived': true } as UpdateQuerySet<Content>;
    return !!(await this.updateOneByProfileAndIdSet(profileRelation, identity, <any>update));
  }

  async unarchive(profileRelation: ProfileRelation, identity: EntityIdentity<T>): Promise<boolean> {
    const update = { 'meta.isArchived': false } as UpdateQuerySet<Content>;
    return !!(await this.updateOneByProfileAndIdSet(profileRelation, identity, <any>update));
  }
}
