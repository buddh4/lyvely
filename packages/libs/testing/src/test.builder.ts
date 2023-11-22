import { Provider, DynamicModule, ForwardReference, Injectable, Inject } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { getObjectId as mongoSeedingGetObjectId } from 'mongo-seeding';
import { CoreModule, LyvelyTestBuilder, createObjectId } from '@lyvely/api';
import { ThrottlerModule } from '@nestjs/throttler';
import { TestConfigService } from './test-config.service';
import { rootMongooseTestModule } from './mongoose-test.utils';

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

export function getObjectId(seed: string) {
  return createObjectId(mongoSeedingGetObjectId(seed).toString());
}
