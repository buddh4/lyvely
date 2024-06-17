import {
  Provider,
  DynamicModule,
  ForwardReference,
  Injectable,
  Inject,
  ModuleMetadata,
  LoggerService,
} from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@lyvely/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule, EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import {
  Test,
  TestingModule,
  TestingModuleBuilder,
  OverrideBy,
  MockFactory,
} from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { disconnect } from 'mongoose';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import { CoreModule } from '../core.module';
import { ModuleRegistry } from '../components';
import { globalEmitter } from '../global.emitter';
import { ClsModule } from 'nestjs-cls';
import { createObjectId } from '@/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { ModuleDefinition } from '@nestjs/core/interfaces/module-definition.interface';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';

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

interface OverrideModule {
  useModule: (newModule: ModuleDefinition) => TestingModuleBuilder;
}

export interface ICoreTestModule extends TestingModule {
  afterEach(): Promise<void>;
}

export interface ITestBuilderOptions {
  providers?: Provider[];
  models?: ModelDefinition[];
  imports?: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>;
  config?: any;
}

export class CoreModuleBuilder {
  private builder: TestingModuleBuilder;
  private testKey: string;

  constructor(testkey: string, options: ITestBuilderOptions = {}) {
    this.testKey = testkey;
    this.builder = Test.createTestingModule({
      imports: [
        ClsModule.forRoot({ global: true, middleware: { mount: true } }),
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongod = await MongoMemoryServer.create();
            const mongoUri = mongod.getUri();
            mongods.set(this.testKey || new Date().toString(), mongod);
            return {
              uri: mongoUri,
            };
          },
        }),
        MongooseModule.forFeature(options?.models || []),
        EventEmitterModule.forRoot({ wildcard: true }),
        ConfigModule.forRoot({
          load: [
            () => import('./lyvely-test.config').then((module) => module.default),
            () => Promise.resolve(options?.config || {}),
          ],
          isGlobal: true,
        }),
        CoreModule,
        ...(options?.imports || []),
      ],
      providers: [...(options?.providers || []), EventTester],
    });
  }

  overridePipe<T = any>(typeOrToken: T): OverrideBy {
    return this.builder.overridePipe(typeOrToken);
  }
  useMocker(mocker: MockFactory): TestingModuleBuilder {
    return this.builder.useMocker(mocker);
  }
  overrideFilter<T = any>(typeOrToken: T): OverrideBy {
    return this.builder.overrideFilter(typeOrToken);
  }
  overrideGuard<T = any>(typeOrToken: T): OverrideBy {
    return this.builder.overrideGuard(typeOrToken);
  }
  overrideInterceptor<T = any>(typeOrToken: T): OverrideBy {
    return this.builder.overrideInterceptor(typeOrToken);
  }
  overrideProvider<T = any>(typeOrToken: T): OverrideBy {
    return this.builder.overrideProvider(typeOrToken);
  }
  overrideModule(moduleToOverride: ModuleDefinition): OverrideModule {
    return this.builder.overrideModule(moduleToOverride);
  }
  async compile(
    options?: Pick<NestApplicationContextOptions, 'snapshot' | 'preview'>
  ): Promise<ICoreTestModule> {
    const module = await this.builder.compile(options);

    (<ICoreTestModule>module).afterEach = async () => {
      module.get(ModuleRegistry)?.reset();
      module.get(EventTester)?.eventEmitter.removeAllListeners();
      globalEmitter.removeAllListeners();
      await closeInMongodConnection(this.testKey);
    };

    return module as ICoreTestModule;
  }
}

export function createCoreTestingModule(
  testKey: string,
  options?: {
    providers?: Provider[];
    models?: ModelDefinition[];
    imports?: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    config?: any;
  }
): CoreModuleBuilder {
  return new CoreModuleBuilder(testKey, options);
}

export async function afterEachTest(key: string, testingModule: TestingModule) {
  testingModule.get(ModuleRegistry)?.reset();
  testingModule.get(EventTester)?.eventEmitter.removeAllListeners();
  globalEmitter.removeAllListeners();
  await closeInMongodConnection(key);
}

export async function afterAllTests() {
  await closeInMongodConnections();
}

export function getObjectId(seed: string) {
  return createObjectId(mongoSeedingGetObjectId(seed).toString());
}
