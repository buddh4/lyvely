import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';

const mongods = new Map<string, MongoMemoryServer>();

export const rootMongooseTestModule = (key?: string, options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      mongods.set(key || new Date().toString(), mongod);
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodConnection = async (key: string) => {
  if (mongods.get(key)) await mongods.get(key)!.stop();
};

export const closeInMongodConnections = async () => {
  for (const value of mongods.values()) {
    await value.stop();
  }
  await disconnect();
  debugger;
};
