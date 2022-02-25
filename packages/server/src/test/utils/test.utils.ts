import { Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TestModule } from '../test.module';
import { UsersModule } from '../../users/users.module';
import { ContentModule } from '../../content';
import { CalendarModule } from '../../calendar/calendar.module';
import { ProfilesModule } from '../../profiles';
import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder';
import { TestDataUtils } from './test-data.utils';
import { PoliciesModule } from '../../policies/policies.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { DynamicModule } from '@nestjs/common/interfaces/modules/dynamic-module.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';
import { CoreModule } from '../../core/core.module';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import mongoose from 'mongoose';

export function createTestingModule(key: string, providers: Provider[] = [], models: ModelDefinition[] = [], modules: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = []): TestingModuleBuilder {
  return Test.createTestingModule({
    imports: [
      TestDataUtils.getMongooseTestModule(key),
      MongooseModule.forFeature([...models]),
      EventEmitterModule.forRoot({ wildcard: true }),
      TestModule,
      CoreModule,
      UsersModule,
      PoliciesModule,
      ContentModule,
      CalendarModule,
      ContentModule,
      ProfilesModule,
      ...modules
    ],
    providers: [...providers],
  });
}

export function getObjectId(id: string) {
  return <mongoose.Types.ObjectId> new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}