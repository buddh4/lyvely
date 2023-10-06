import { Provider, DynamicModule, ForwardReference, Injectable, Inject } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@lyvely/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { disconnect } from 'mongoose';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import { CoreModule } from '../core.module';
import { ModuleRegistry } from '../components';
import { EventEmitter2 } from 'eventemitter2';
import { globalEmitter } from '../global.emitter';

const mongods = new Map<string, MongoMemoryServer>();

export const closeInMongodConnection = async (key: string) => {
  if (mongods.get(key)) await mongods.get(key)!.stop();
  await disconnect();
};

export const closeInMongodConnections = async () => {
  for (const value of mongods.values()) {
    await value.stop();
  }
  await disconnect();
};

@Injectable()
export class EventTester {
  @Inject()
  public eventEmitter: EventEmitter2;
}

export function createCoreTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
  config = {},
): TestingModuleBuilder {
  return Test.createTestingModule({
    imports: [
      MongooseModule.forRootAsync({
        useFactory: async () => {
          const mongod = await MongoMemoryServer.create();
          const mongoUri = mongod.getUri();
          mongods.set(key || new Date().toString(), mongod);
          return {
            uri: mongoUri,
          };
        },
      }),
      MongooseModule.forFeature([...models]),
      EventEmitterModule.forRoot({ wildcard: true }),
      ConfigModule.forRoot({
        load: [
          () => import('./lyvely-test.config').then((module) => module.default),
          () => Promise.resolve(config),
        ],
        isGlobal: true,
      }),
      CoreModule,
      ...imports,
    ],
    providers: [...providers, EventTester],
  });
}

export async function afterEachTest(key: string, testingModule: TestingModule) {
  testingModule.get(ModuleRegistry)?.reset();
  testingModule.get(EventTester)?.eventEmitter.removeAllListeners();
  globalEmitter.removeAllListeners();
  await closeInMongodConnection(key);
}

export async function afterAllTests(key: string) {
  await closeInMongodConnections();
}

export function getObjectId(id: string) {
  return new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
