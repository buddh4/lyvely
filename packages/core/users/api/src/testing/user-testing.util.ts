import { createCoreTestingModule, TestConfigService } from '@lyvely/testing';
import { Provider, DynamicModule, ForwardReference } from '@nestjs/common';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';
import { Type } from '@lyvely/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users.module';
import { UserTestDataUtils } from './user-test-data.utils';

export function createUserTestingModule(
  key: string,
  providers: Provider[] = [],
  models: ModelDefinition[] = [],
  imports: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [],
): TestingModuleBuilder {
  imports.push(UsersModule);
  providers.push(UserTestDataUtils);
  return createCoreTestingModule(key, providers, models, imports)
    .overrideProvider(ConfigService)
    .useClass(TestConfigService);
}
