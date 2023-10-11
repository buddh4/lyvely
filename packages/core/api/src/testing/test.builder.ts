import { Provider, DynamicModule, ForwardReference, Injectable, Inject } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import mongoose from 'mongoose';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import { CoreModule, ModuleRegistry, globalEmitter } from '@/core';
import { PropertiesOf } from '@lyvely/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TestConfigService } from './test-config.service';
import {
  closeInMongodConnection,
  closeInMongodConnections,
  rootMongooseTestModule,
} from './mongoose-test.utils';

export type Type<T = any> = new (...args: any[]) => T;

export interface TestPlugin {
  apply?: (builder: LyvelyTestBuilder) => void;
  prepare?: (moduleBuilder: TestingModuleBuilder) => void;
  afterEach?: (module: TestingModule) => void;
  afterAll?: (module: TestingModule) => void;
}

export interface LyvelyTestingModule extends TestingModule {
  afterEach(): Promise<void>;
  afterAll(): Promise<void>;
}

@Injectable()
export class EventTester {
  @Inject()
  public eventEmitter: EventEmitter2;
}

export class LyvelyTestBuilder {
  private readonly id: string;
  private _providers: Provider[] = [];
  private _models: ModelDefinition[] = [];
  private _imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [];
  private _config: any = {};
  private _plugins: TestPlugin[] = [];

  constructor(id: string, init: Partial<PropertiesOf<LyvelyTestBuilder>> = {}) {
    this.id = id;
    Object.assign(this, init);
  }

  models(models: ModelDefinition[]) {
    this._models.push(...models);
    return this;
  }

  providers(providers: Provider[]) {
    this._providers.push(...providers);
    return this;
  }

  imports(imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>) {
    this._imports.push(...imports);
    return this;
  }

  config(config: any) {
    this._config = Object.assign(this._config, config);
    return this;
  }

  plugins(plugins: TestPlugin[]) {
    plugins.forEach((plugin) => plugin.apply?.(this));
    this._plugins.push(...plugins);
    return this;
  }

  build() {
    const moduleBuilder = createCoreTestingModule(
      this.id,
      [...new Set(this._providers)],
      [...new Set(this._models)],
      [...new Set(this._imports)],
      this._config,
    );
    this._plugins.forEach((plugin) => plugin.prepare?.(moduleBuilder));
    return moduleBuilder;
  }

  async compile(): Promise<LyvelyTestingModule> {
    const testingModule = await this.build().compile();
    (<LyvelyTestingModule>(<any>testingModule)).afterEach = async () => {
      testingModule.get(ModuleRegistry)?.reset();
      testingModule.get(EventTester)?.eventEmitter.removeAllListeners();
      globalEmitter.removeAllListeners();
      this._plugins.forEach((plugin) => plugin.afterEach?.(testingModule));
      await closeInMongodConnection(this.id);
    };
    (<LyvelyTestingModule>(<any>testingModule)).afterAll = async () => {
      this._plugins.forEach((plugin) => plugin.afterAll?.(testingModule));
      await closeInMongodConnections();
    };
    return testingModule as LyvelyTestingModule;
  }
}

export function buildTest(id: string, init: Partial<LyvelyTestBuilder> = {}) {
  return new LyvelyTestBuilder(id, init);
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
      rootMongooseTestModule(key),
      ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          ttl: config.get('http.rateLimit.ttl') || 60,
          limit: config.get('http.rateLimit.limit') || 40,
        }),
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
    providers: [EventTester, ...providers],
  })
    .overrideProvider(ConfigService)
    .useClass(TestConfigService);
}

export function getObjectId(id: string) {
  return new mongoose.Types.ObjectId(mongoSeedingGetObjectId(id).toString());
}