import { Type, DynamicModule, ForwardReference, Provider, Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule, ConfigurationPath, setTransactionSupport } from '@/modules/core';
import { AuthModule } from './modules/auth/auth.module';
import { RegisterModule } from './modules/register/register.module';
import { UsersModule } from './modules/users';
import { ProfilesModule } from './modules/profiles';
import { PoliciesModule } from './modules/policies/policies.module';
import { ContentModule } from './modules/content';
import { ActivitiesModule } from './modules/activities/activities.module';
import { TagsModule } from './modules/tags/tags.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from './modules/core/config/configuration';
import { MailsModule } from './modules/mails/mails.module';
import {
  ConfigUserPermissionsService,
  UserPermissionsServiceInjectionToken,
  UserPermissionsServiceProvider,
} from './modules/user-permissions';

type Import = Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

export interface IAppModuleBuilderOptions {
  useRecommended?: boolean;
  useFeatures?: boolean;
  configFiles?: Array<string>;
  providers?: LyvelyProviderOptions;
  serveStatic?: boolean;
}

type ProviderOption<T = any> = { useClass: Type<T> } | { useValue: T } | Provider<T>;
type ProviderToken = string | symbol;

interface ICoreLyvelyProviderOptions {
  [UserPermissionsServiceInjectionToken]?: ProviderOption<UserPermissionsServiceProvider>;
}

const defaultProviders: Required<ICoreLyvelyProviderOptions> = {
  [UserPermissionsServiceInjectionToken]: { useClass: ConfigUserPermissionsService },
};

export type LyvelyProviderOptions = ICoreLyvelyProviderOptions & Record<ProviderToken, ProviderOption>;

function getDefaultProvider<T>(token: ProviderToken): Provider<T> | undefined {
  return defaultProviders[token];
}

function getProvider<T>(options: IAppModuleBuilderOptions, token: ProviderToken): Provider<T> | undefined {
  options.providers = options.providers || {};
  const providerOption = options.providers[token] || getDefaultProvider(token);
  if (!providerOption) return undefined;
  return getProviderFromOption(token, providerOption);
}

function getProviderFromOption<T>(token: ProviderToken, option: ProviderOption): Provider<T> {
  return 'provide' in option ? option : Object.assign({ provide: token }, option);
}

export class AppModuleBuilder {
  private readonly imports: Array<Import> = [];
  private readonly providers: Array<Provider> = [];
  private options: IAppModuleBuilderOptions;

  constructor(options: IAppModuleBuilderOptions = {}) {
    this.imports = [];
    this.options = options;

    this.initCoreModules()
      .initCoreProviders()
      .initConfigModule()
      .initServeStaticModule()
      .initMongooseModule()
      .initRecommendedModules()
      .initFeatureModules();
  }

  private initCoreModules() {
    return this.importModules(
      EventEmitterModule.forRoot({ wildcard: true }),
      MailsModule.fromConfig(),
      CoreModule,
      PoliciesModule,
      UsersModule,
      AuthModule,
    );
  }

  private initCoreProviders() {
    const providers = Object.keys(defaultProviders)
      .map((token) => getProvider(this.options, token))
      .filter((provider) => !!provider);
    return this.useProviders(...providers);
  }

  private initServeStaticModule() {
    if (!this.options.serveStatic) {
      return this;
    }

    return this.importModules(
      ServeStaticModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) => {
          // TODO (serveStatic) provide some defaults...
          return configService.get('serveStatic');
        },
      }),
    );
  }

  private initMongooseModule() {
    return this.importModules(
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) => {
          setTransactionSupport(configService.get('mongodb.transactions', false));
          return {
            uri: configService.get('mongodb.uri'),
            autoIndex: true,
          };
        },
      }),
    );
  }

  private initConfigModule() {
    const configs = [configuration()];
    if (this.options.configFiles) {
      configs.push(...this.options.configFiles.map((file) => configuration(file)));
    }

    return this.importModules(
      ConfigModule.forRoot({
        load: configs,
        isGlobal: true,
      }),
    );
  }

  private initRecommendedModules() {
    if (this.options.useRecommended === false) {
      return this;
    }

    return this.importModules(ProfilesModule, TagsModule, RegisterModule, ContentModule, TagsModule);
  }

  private initFeatureModules() {
    if (this.options.useFeatures === false) {
      return this;
    }

    return this.importModules(ActivitiesModule);
  }

  public importModules(...module: Array<Import>) {
    this.imports.push(...module);
    return this;
  }

  public useProviders(...providers: Array<Provider>) {
    this.providers.push(...providers);
    return this;
  }

  public build() {
    @Global()
    @Module({
      imports: this.imports,
      providers: this.providers,
    })
    class AppModule {}
    return AppModule;
  }
}
