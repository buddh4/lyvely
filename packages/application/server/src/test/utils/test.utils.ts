import { Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { UsersModule } from '@lyvely/users';
import { ContentCoreModule } from '@lyvely/content';
import { ProfilesModule } from '@lyvely/profiles';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { TestDataUtils } from './test-data.utils';
import { TestModule } from '../test.module';
import { PoliciesModule } from '@/policies/policies.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@lyvely/common';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import mongoose from 'mongoose';
import { MailsModule } from '@/mails/mails.module';
import { ConfigurationPath, CoreModule } from '@lyvely/core';
import { AppConfigModule } from '@/app-config';
import { I18nModule } from '@lyvely/i18n';
import { ThrottlerModule } from '@nestjs/throttler';
import { LiveModule } from '@/live/live.module';
import { NotificationsModule } from '@/notifications/notifications.module';
import { getQueueToken } from '@nestjs/bullmq';
import { QUEUE_NOTIFICATIONS_SEND } from '@/notifications/notification.constants';
import { I18nModule as NestjsI18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import path from 'path';
import { FeatureModule } from '@/features/feature.module';
import { MailService } from '@/mails';
import { TestMailService } from '@/mails/services/test-mail.service';
import { TestConfigService } from '@/test/utils/test-config.service';
import { OtpService } from '@/user-otp';
import { TestOtpService } from '@/test/utils/test-otp.service';

export function createCoreTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
  config = {},
): TestingModuleBuilder {
  return Test.createTestingModule({
    imports: [
      TestDataUtils.getMongooseTestModule(key),
      MongooseModule.forFeature([...models]),
      EventEmitterModule.forRoot({ wildcard: true }),
      ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService<ConfigurationPath>) => ({
          ttl: config.get('http.rateLimit.ttl') || 60,
          limit: config.get('http.rateLimit.limit') || 40,
        }),
      }),
      CoreModule,
      FeatureModule,
      AppConfigModule,
      NestjsI18nModule.forRoot({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '../../i18n/locales/'),
        },
        resolvers: [AcceptLanguageResolver],
      }),
      I18nModule,
      ConfigModule.forRoot({
        load: [
          () => import('./lyvely-test.config').then((module) => module.default),
          () => Promise.resolve(config),
        ],
        isGlobal: true,
      }),
      MailsModule.fromConfig(),
      ...imports,
    ],
    providers: [...providers],
  });
}

export function createBasicTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  imports.push(
    UsersModule,
    ProfilesModule,
    PoliciesModule,
    TestModule,
    LiveModule,
    NotificationsModule,
  );
  return createCoreTestingModule(key, providers, models, imports)
    .overrideProvider(getQueueToken(QUEUE_NOTIFICATIONS_SEND))
    .useValue({
      add: jest.fn(),
      process: jest.fn(),
      on: jest.fn(),
    })
    .overrideProvider(MailService)
    .useClass(TestMailService)
    .overrideProvider(ConfigService)
    .useClass(TestConfigService)
    .overrideProvider(OtpService)
    .useClass(TestOtpService);
}

export function createContentTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  imports.push(ContentCoreModule);
  return createBasicTestingModule(key, providers, models, imports);
}

export function getObjectId(id: string) {
  return <TObjectId>new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
