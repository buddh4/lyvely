import { Provider, DynamicModule, ForwardReference } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@lyvely/core-common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { disconnect } from 'mongoose';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';

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

export function createCoreTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  imports: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
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
      ...imports,
    ],
    providers: [...providers],
  });
}

export function getObjectId(id: string) {
  return new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}
