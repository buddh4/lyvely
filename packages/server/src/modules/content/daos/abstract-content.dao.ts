import { Content } from '../schemas';
import { EntityIdentity } from '../../core/db/db.utils';
import { BaseProfileModelDao, ProfileRelation } from "../../profiles";

export abstract class AbstractContentDao<T extends Content> extends BaseProfileModelDao<T> {

  protected getModelType(): string | null {
    return 'content';
  }

  async archive(profileRelation: ProfileRelation, identity: EntityIdentity<T>): Promise<boolean> {
    return !!(await this.updateOneByProfileAndIdSet(profileRelation, identity, <any> { archived: true }));
  }

  async unarchive(profileRelation: ProfileRelation, identity: EntityIdentity<T>): Promise<boolean> {
    return !!(await this.updateOneByProfileAndIdSet(profileRelation, identity, <any> { archived: false }));
  }
}
