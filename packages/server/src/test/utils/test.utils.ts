import { Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { UsersModule } from '@/users';
import { ContentModule } from '@/content';
import { ProfilesModule } from '@/profiles';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { TestDataUtils } from './test-data.utils';
import { TestModule } from '../test.module';
import { PoliciesModule } from '@/policies/policies.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import mongoose from 'mongoose';
import { MailsModule } from '@/mails/mails.module';
import { ConfigurationPath, CoreModule } from '@/core';
import { AppConfigModule } from '@/app-config';
import { I18nModule } from '@/i18n';
import { ThrottlerModule } from '@nestjs/throttler';

export function createCoreTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
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
      AppConfigModule,
      I18nModule,
      ConfigModule.forRoot({
        load: [() => import('./lyvely-test.config').then((module) => module.default)],
        isGlobal: true,
      }),
      MailsModule.fromConfig(),
      ...modules,
    ],
    providers: [...providers],
  });
}

export function createBasicTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  modules.push(UsersModule, ProfilesModule, PoliciesModule, TestModule);
  return createCoreTestingModule(key, providers, models, modules);
}

export function createContentTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  modules.push(ContentModule.forRoot());
  return createBasicTestingModule(key, providers, models, modules);
}

export function getObjectId(id: string) {
  return <TObjectId>new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
