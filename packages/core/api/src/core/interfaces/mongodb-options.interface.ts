import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

export interface IMongoDBOptions extends MongooseModuleOptions {
  uri: string;
  debug?: boolean;
  replicaSet?: string;
  transactions?: boolean;
}
