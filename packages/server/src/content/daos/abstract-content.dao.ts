import { AbstractDao } from '../../db/abstract.dao';
import { Content } from '../schemas';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';

export abstract class AbstractContentDao<T extends Content> extends AbstractDao<T> {

  protected getModelType(): string | null {
    return 'content';
  }

  async archive(entity: EntityIdentity<T>): Promise<boolean> {
    return !!(await this.model.updateOne({_id: assureObjectId(entity)}, {archived: true})).modifiedCount;
  }

  async unarchive(entity: EntityIdentity<T>): Promise<boolean> {
    return !!(await this.model.updateOne({_id: assureObjectId(entity)}, {archived: false})).modifiedCount;
  }
}