import { Type, DynamicModule, ForwardReference, Provider, Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { I18nModule, I18nModuleLoader } from './i18n';
import {
  CoreModule,
  ReverseProxyThrottlerGuard,
  setTransactionSupport,
  ConfigurationPath,
  ILyvelyMongoDBOptions,
  ServerConfiguration,
} from './core';
import { AppConfigModule, loadConfig } from './app-config';
import { AuthModule } from './auth';
import { UsersModule } from './users';
import { MessageModule } from './messages';
import { UserRegistrationsModule } from './user-registrations';
import { ProfilesModule } from './profiles';
import {
  ConfigUserPermissionsService,
  UserPermissionsServiceInjectionToken,
  UserPermissionsServiceProvider,
} from './permissions';
import { PoliciesModule } from './policies';
import { ContentCoreModule } from './content';
import { MailsModule } from './mails';
import { UserAccountsModule } from './user-accounts';
import { CaptchaModule } from './captchas';
import { AvatarsModule } from './avatars';
import { LiveModule } from './live';
import { NotificationsModule } from './notifications';
import { FeaturesModule } from './features';
import { UserInvitationsModule } from './user-invitations';
import { SystemMessagesModule } from './system-messages';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import path, { join } from 'path';
import { I18nModule as NestjsI18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bullmq';

type TModule = Type | DynamicModule | Promise<DynamicModule> | ForwardReference;

export interface IAppModuleBuilderOptions {
  useRecommended?: boolean;
  useFeatures?: boolean;
  configFiles?: Array<string>;
  providers?: LyvelyProviderOptions;
  serveStatic?: boolean;
  modules?: TModule[];
}

type ProviderOption<T = any> = { useClass: Type<T> } | { useValue: T } | Provider<T>;
type ProviderToken = string | symbol;

interface ICoreLyvelyProviderOptions {
  [UserPermissionsServiceInjectionToken]?: ProviderOption<UserPermissionsServiceProvider>;
}

const defaultProviders: Required<ICoreLyvelyProviderOptions> = {
  [UserPermissionsServiceInjectionToken]: {
    useClass: ConfigUserPermissionsService,
  },
};

export type LyvelyProviderOptions = ICoreLyvelyProviderOptions &
  Record<ProviderToken, ProviderOption>;

function getDefaultProvider<T>(token: ProviderToken): Provider<T> | undefined {
  return defaultProviders[token];
}

function getProvider<T>(
  options: IAppModuleBuilderOptions,
  token: ProviderToken,
): Provider<T> | undefined {
  options.providers = options.providers || {};
  const providerOption = options.providers[token] || getDefaultProvider(token);
  if (!providerOption) return undefined;
  return getProviderFromOption(token, providerOption);
}

function getProviderFromOption<T>(token: ProviderToken, option: ProviderOption): Provider<T> {
  return 'provide' in option ? option : Object.assign({ provide: token }, option);
}

export function buildApp(options: IAppModuleBuilderOptions = {}) {
  return new AppModuleBuilder(options);
}

export class AppModuleBuilder {
  private readonly imports: Array<TModule> = [];
  private readonly providers: Array<Provider> = [];
  private options: IAppModuleBuilderOptions;

  constructor(options: IAppModuleBuilderOptions = {}) {
    this.imports = [];
    this.options = options;
    this.options.modules ??= [];

    this.initCoreModules()
      .initCoreProviders()
      .initConfigModule()
      .initQueueModule()
      .initUploadModules()
      .initRateLimitModule()
      .initServeStaticModule()
      .initMongooseModule()
      .initRecommendedModules()
      .importModules(...this.options.modules);
  }

  private initCoreModules() {
    return this.importModules(
      EventEmitterModule.forRoot({ wildcard: true }),
      LiveModule,
      MailsModule.fromConfig(),
      NotificationsModule,
      CoreModule,
      FeaturesModule,
      AppConfigModule,
      NestjsI18nModule.forRoot({
        fallbackLanguage: 'en',
        loader: I18nModuleLoader,
        loaderOptions: {},
        resolvers: [AcceptLanguageResolver],
      }),
      I18nModule,
      PoliciesModule.forRoot(),
      UsersModule,
      AuthModule,
      CaptchaModule,
    );
  }

  private initCoreProviders() {
    const providers = Object.keys(defaultProviders)
      .map((token) => getProvider(this.options, token))
      .filter((provider) => !!provider) as Provider[];
    return this.useProviders(...providers);
  }

  private initQueueModule() {
    return this.importModules(
      BullModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) => {
          return { connection: configService.get('redis') };
        },
      }),
    );
  }

  private initUploadModules() {
    return this.importModules(
      MulterModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) =>
          configService.get('file.upload') || {
            dest: path.join(process.cwd(), 'uploads'),
            limits: {
              fileSize: 1_073_741_824, // 1GB
            },
          },
      }),
    );
  }

  private initServeStaticModule() {
    if (!this.options.serveStatic) return this;

    return this.importModules(
      ServeStaticModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) => {
          // TODO (serveStatic) provide some defaults...
          return [configService.get('serveStatic', {})];
        },
      }),
    );
  }

  private initMongooseModule() {
    return this.importModules(
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath & any>) => {
          const options = { ...configService.get<ILyvelyMongoDBOptions>('mongodb') };

          setTransactionSupport(!!options.transactions);
          delete options.transactions;
          delete options.debug;

          options.autoIndex ??= true;
          options.useNewUrlParser ??= true;
          options.useUnifiedTopology ??= true;

          return options;
        },
      }),
    );
  }

  private initConfigModule() {
    this.options.configFiles ??= ['config/lyvely.ts'];
    const loader: Array<() => Promise<ServerConfiguration>> = [];
    if (this.options.configFiles) {
      loader.push(...this.options.configFiles.map((file) => loadConfig(file)));
    }

    return this.importModules(
      ConfigModule.forRoot({
        load: loader,
        isGlobal: true,
      }),
    );
  }

  private initRateLimitModule() {
    return this.importModules(
      ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService<ConfigurationPath>) => ({
          ttl: config.get('http.rateLimit.ttl') || 60,
          limit: config.get('http.rateLimit.limit') || 60,
        }),
      }),
    ).useProviders({
      provide: APP_GUARD,
      useClass: ReverseProxyThrottlerGuard,
    });
  }

  private initRecommendedModules() {
    if (this.options.useRecommended === false) {
      return this;
    }

    return this.importModules(
      ProfilesModule,
      UserRegistrationsModule,
      ContentCoreModule,
      MessageModule,
      SystemMessagesModule,
      UserAccountsModule,
      AvatarsModule,
      UserInvitationsModule,
    );
  }

  public importModules(...module: Array<TModule>) {
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
