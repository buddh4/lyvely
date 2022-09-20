import { Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { UsersModule } from '../../users';
import { ContentModule } from '../../content';
import { ProfilesModule } from '../../profiles';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { TestDataUtils } from './test-data.utils';
import { PoliciesModule } from '../../policies/policies.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { CoreModule } from '../../../core/core.module';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import mongoose from 'mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

export function createCoreTestingModule(key: string, providers: Provider[] = [], models: ModelDefinition[] = [], modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = []): TestingModuleBuilder {
  return Test.createTestingModule({
    imports: [
      TestDataUtils.getMongooseTestModule(key),
      MongooseModule.forFeature([...models]),
      EventEmitterModule.forRoot({ wildcard: true }),
      CoreModule,
      MailerModule.forRootAsync({
        useFactory: () => ({
          transport: {
            jsonTransport: true
          },
          defaults: {
            from: '"No Reply" <no-reply@localhost>',
          },
          preview: false,
          template: {
            dir: process.cwd() + '/template/',
            adapter: new PugAdapter(),
            options: {
              strict: true,
            },
          }
        })
      }),
      ...modules
    ],
    providers: [...providers],
  });
}

export function createBasicTestingModule(key: string, providers: Provider[] = [], models: ModelDefinition[] = [], modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = []): TestingModuleBuilder {
  modules.push(UsersModule, ProfilesModule, PoliciesModule, TestModule)
  return createCoreTestingModule(key, providers, models, modules);
}

export function createContentTestingModule(key: string, providers: Provider[] = [], models: ModelDefinition[] = [], modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = []): TestingModuleBuilder {
  modules.push(ContentModule);
  return createBasicTestingModule(key, providers, models, modules);
}

export function getObjectId(id: string) {
  return <TObjectId> new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}