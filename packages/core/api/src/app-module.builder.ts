import {
  Type,
  DynamicModule,
  ForwardReference,
  Provider,
  Global,
  Module,
  Logger,
} from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { I18nModule, I18nModuleLoader } from '@/i18n';
import { CoreModule, ReverseProxyThrottlerGuard, setTransactionSupport } from '@/core';
import {
  ConfigurationPath,
  ILyvelyMongoDBOptions,
  ServerConfiguration,
  loadConfigs,
} from '@/config';
import { AppConfigModule } from '@/app-config';
import { AuthModule } from '@/auth';
import { UsersModule } from '@/users';
import { MessageModule } from '@/messages';
import { UserRegistrationModule } from '@/user-registration';
import { ProfilesModule } from '@/profiles';
import { PoliciesModule } from '@/policies';
import { ContentCoreModule } from '@/content';
import { MailsModule } from '@/mails';
import { UserAccountModule } from '@/user-account';
import { CaptchaModule } from '@/captcha';
import { AvatarsModule } from '@/avatars';
import { LiveModule } from '@/live';
import { NotificationsModule } from '@/notifications';
import { FeaturesModule } from '@/features';
import { UserInvitationsModule } from '@/user-invitations';
import { SystemMessagesModule } from '@/system-messages';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule as NestjsI18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { PermissionsModule } from '@/permissions/permissions.module';
import { PingModule } from '@/ping';
import { DeepPartial } from '@lyvely/common';
import defaultConfig from '@/config/lyvely.default.config';
import { FilesModule } from '@/files/files.module';
import { ClsModule } from 'nestjs-cls';
import { resolve } from 'node:path';

type TModule = Type | DynamicModule | Promise<DynamicModule> | ForwardReference;

export interface IAppModuleBuilderOptions {
  useRecommended?: boolean;
  configFiles?: Array<string> | false;
  loadDefaultConfig?: boolean;
  loadDBConfig?: boolean;
  config?: DeepPartial<ServerConfiguration> | null;
  serveStatic?: boolean;
  manual?: boolean;
  modules?: TModule[];
}

const defaultOptions: Required<IAppModuleBuilderOptions> = {
  useRecommended: true,
  configFiles: false,
  loadDefaultConfig: true,
  loadDBConfig: true,
  config: null,
  serveStatic: false,
  manual: false,
  modules: [],
};

export class AppModuleBuilder {
  private readonly imports: Array<TModule> = [];
  private readonly providers: Array<Provider> = [];
  private options: Required<IAppModuleBuilderOptions>;
  private logger = new Logger(AppModuleBuilder.name);

  constructor(options: IAppModuleBuilderOptions = {}) {
    this.imports = [];
    this.options = { ...defaultOptions, ...options };

    if (!this.options.manual) {
      this.importClsModule()
        .importEventEmitterModule()
        .importCoreModules()
        .importI18nModule()
        .importQueueModule()
        .importRateLimitModule()
        .importServeStaticModule()
        .importMongooseModule()
        .importRecommendedModules()
        .importModules(...this.options.modules);
    }
  }

  public async importConfigModule() {
    const configs: Array<string | Partial<ServerConfiguration>> = [];

    if (this.options.loadDefaultConfig !== false) {
      configs.push(defaultConfig);
    }

    if (Array.isArray(this.options.configFiles)) {
      configs.push(...this.options.configFiles);
    }

    if (this.options.config) {
      configs.push(this.options.config as Partial<ServerConfiguration>);
    }

    const config = await loadConfigs(configs)();

    return this.importModules(
      ConfigModule.forRoot({
        load: [() => config],
        isGlobal: true,
      })
    );
  }

  public importCoreModules() {
    return this.importModules(
      CoreModule,
      LiveModule,
      PingModule,
      MailsModule.fromConfig(),
      ProfilesModule,
      ContentCoreModule,
      SystemMessagesModule,
      UserAccountModule,
      NotificationsModule,
      FeaturesModule,
      PermissionsModule,
      AppConfigModule,
      PoliciesModule.forRoot(),
      UsersModule,
      AuthModule,
      CaptchaModule,
      FilesModule
    );
  }

  public importClsModule() {
    return this.importModules(ClsModule.forRoot({ global: true, middleware: { mount: true } }));
  }

  public importEventEmitterModule() {
    return this.importModules(EventEmitterModule.forRoot({ wildcard: true, global: true }));
  }

  public importI18nModule() {
    return this.importModules(
      NestjsI18nModule.forRoot({
        fallbackLanguage: 'en',
        loader: I18nModuleLoader,
        loaderOptions: {},
        resolvers: [AcceptLanguageResolver],
      }),
      I18nModule
    );
  }

  public importQueueModule() {
    return this.importModules(
      BullModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) => {
          return { connection: configService.get('redis')! };
        },
      })
    );
  }

  public importServeStaticModule() {
    if (!this.options.serveStatic) return this;

    return this.importModules(
      ServeStaticModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) => {
          // TODO (serveStatic) provide some defaults...
          return [
            configService.get('serveStatic', {
              rootPath: resolve(__dirname, '../static'),
            }),
          ];
        },
      })
    );
  }

  public importMongooseModule() {
    return this.importModules(
      MongooseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath & any>) => {
          const options = { ...configService.get<ILyvelyMongoDBOptions>('mongodb') };

          // Just to assure we do not kill another db with our e2e tests.
          if (process.env.NODE_ENV === 'e2e' && !options.uri) {
            throw new Error('e2e test can not fallback to the default mongodb uri.');
          } else if (process.env.NODE_ENV === 'e2e' && !options.uri!.endsWith('e2e')) {
            this.logger.warn('Added e2e suffix to mongo uri.');
            options.uri += 'e2e';
          }

          setTransactionSupport(!!options.transactions);
          delete options.transactions;
          delete options.debug;

          options.autoIndex ??= true;

          return options;
        },
      })
    );
  }

  public importRateLimitModule() {
    return this.importModules(
      ThrottlerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService<ConfigurationPath>) => ({
          throttlers: [
            {
              ttl: config.get('http.rateLimit.ttl') || 60_000,
              limit: config.get('http.rateLimit.limit') || 120,
            },
          ],
        }),
      })
    ).useProviders({
      provide: APP_GUARD,
      useClass: ReverseProxyThrottlerGuard,
    });
  }

  public importRecommendedModules() {
    if (this.options.useRecommended === false) {
      return this;
    }

    return this.importModules(
      AvatarsModule,
      MessageModule,
      UserRegistrationModule,
      UserInvitationsModule
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

  public async build() {
    /*
     * This is a patch for https://stackoverflow.com/questions/69771141/nestjs-configmodule-forroot-asynchronuous
     * The config was not loaded before the useFactory calls of other modules.
     * TODO: Investigate a bit more, maybe open an issue
     */
    await this.importConfigModule();

    @Global()
    @Module({
      imports: this.imports,
      providers: this.providers,
    })
    class AppModule {}
    return AppModule;
  }
}
