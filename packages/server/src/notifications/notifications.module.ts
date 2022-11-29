import { Injectable, Module, OnModuleInit, Type } from '@nestjs/common';
import { NotificationTypeRegistry } from '@/notifications/components/notification-type.registry';
import { UserNotificationsService } from '@/notifications/services/user-notifications.service';
import { UserNotificationDao, NotificationDao } from '@/notifications/daos';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import {
  NotificationType,
  Notification,
  NotificationSchema,
  UserNotification,
  UserNotificationSchema,
} from '@/notifications/schemas';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { NotificationTypeSchemaFactory } from '@/notifications/schemas/notification-type-schema.factory';
import { MisconfigurationException } from '@lyvely/common';

const NotificationModels = MongooseModule.forFeature([
  {
    name: Notification.name,
    schema: NotificationSchema,
  },
  {
    name: UserNotification.name,
    schema: UserNotificationSchema,
  },
]);

@Module({})
export class NotificationCoreModule {
  static forRoot(): DynamicModule {
    return NotificationCoreModule.registerCore();
  }

  static registerCore() {
    return {
      module: NotificationsModule,
      imports: [NotificationModels],
      providers: [NotificationTypeRegistry, UserNotificationsService, UserNotificationDao, NotificationDao],
      exports: [
        NotificationTypeRegistry,
        UserNotificationsService,
        NotificationModels,
        UserNotificationDao,
        NotificationDao,
      ],
    };
  }
}

export interface NotificationTypeRegistration {
  type: Type<NotificationType>;
  schema: Schema<NotificationType>;
}

@Module({})
export class NotificationsModule {
  static forRoot() {
    return NotificationCoreModule.registerCore();
  }

  static registerNotificationTypes(...notificationTypes: Type<NotificationType>[]): DynamicModule {
    return {
      module: NotificationsModule,
      imports: [NotificationCoreModule.registerCore()],
      providers: [registerNotificationTypeOnInit(notificationTypes)],
    };
  }
}

function registerNotificationTypeOnInit(notificationTypes: Type<NotificationType>[]) {
  @Injectable()
  class RegisterNotificationTypeService implements OnModuleInit {
    constructor(
      private notificationTypeRegistry: NotificationTypeRegistry,
      @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    ) {}

    onModuleInit(): any {
      if (notificationTypes && notificationTypes.length) {
        this.notificationTypeRegistry.registerTypes(notificationTypes.map((type) => ({ type })));
        notificationTypes.forEach((notificationType) => {
          const schema = NotificationTypeSchemaFactory.getSchemaByType(notificationType);

          if (!schema) {
            throw new MisconfigurationException(`No Schema registered for notification type ${notificationType.name}.`);
          }

          this.notificationModel.schema
            .path<Schema.Types.Subdocument>('data')
            .discriminator(notificationType.name, schema);
        });
      }
    }
  }

  return RegisterNotificationTypeService;
}
