import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

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
  if (mongods.get(key)) await mongods.get(key).stop();
};

export const closeInMongodConnections = async () => {
  return Promise.all(Array.of(...mongods.values()).map((mongod) => mongod.stop()));
};
