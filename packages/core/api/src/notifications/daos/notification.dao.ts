import { AbstractDao, createBaseDocumentInstance, Dao, LeanDoc } from '@/core';
import { Notification } from '../schemas';
import { NotificationTypeRegistry } from '../components';
import { TenancyIsolation } from '@/core/tenancy';

@Dao(Notification, { isolation: TenancyIsolation.Strict })
export class NotificationDao extends AbstractDao<Notification> {
  constructor(private notificationTypeRegistry: NotificationTypeRegistry) {
    super();
  }

  protected override constructModel(lean: LeanDoc<Notification>): Notification {
    const result = super.constructModel(lean);
    if (result.data?.type) {
      result.data = createBaseDocumentInstance(
        this.notificationTypeRegistry.getTypeConstructor(result.data.type)!,
        lean.data!
      );
    }
    return result;
  }
}
