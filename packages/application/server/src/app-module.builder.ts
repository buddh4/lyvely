import { Type, DynamicModule, ForwardReference, Provider, Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  CoreModule,
  setTransactionSupport,
  ConfigurationPath,
  LyvelyMongoDBOptions,
} from '@lyvely/core';
import { loadConfig, AppConfigModule } from '@/app-config';
import { AuthModule } from './auth/auth.module';
import { UserRegistrationModule } from './user-registration/user-registration.module';
import { UsersModule } from './users';
import { ProfilesModule } from './profiles';
import { PoliciesModule } from './policies/policies.module';
import { ContentCoreModule } from './content';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { MailsModule } from './mails/mails.module';
import path from 'path';
import {
  ConfigUserPermissionsService,
  UserPermissionsServiceInjectionToken,
  UserPermissionsServiceProvider,
} from './user-permissions';
import { I18nModule } from '@/i18n/i18n.module';
import { I18nModule as NestjsI18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { AccountModule } from '@/account/account.module';
import { CaptchaModule } from '@/captcha/captcha.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ReverseProxyThrottlerGuard } from '@/throttler';
import { MulterModule } from '@nestjs/platform-express';
import { AvatarsModule } from '@/avatars/avatars.module';
import { LiveModule } from '@/live/live.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from '@/notifications/notifications.module';
import { FeatureModule } from '@/features/feature.module';
import { ContentStreamModule } from '@/content-stream/content-stream.module';
import { MessageModule } from '@/message/message.module';
import { JournalsModule } from '@/journals/journals.module';
import { TasksModule } from '@/tasks/tasks.module';
import { HabitsModule } from '@/habits/habits.module';
import { MilestonesModule } from '@/milestones/milestones.module';
import { InvitationsModule } from '@/invitations/invitations.module';
//import { LoggerModule } from 'nestjs-pino';
import { SystemMessagesModule } from '@/system-messages/system-messages.module';
import { LegalModule } from '@/legal/legal.module';

type Import = Type | DynamicModule | Promise<DynamicModule> | ForwardReference;

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
      .initQueueModule()
      .initUploadModules()
      .initRateLimitModule()
      .initServeStaticModule()
      .initMongooseModule()
      .initRecommendedModules()
      .initFeatureModules();
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

  private initCoreModules() {
    return this.importModules(
      EventEmitterModule.forRoot({ wildcard: true }),
      /* LoggerModule.forRoot({
        pinoHttp: { level: 'debug' },
      }),*/
      LiveModule,
      MailsModule.fromConfig(),
      NotificationsModule,
      CoreModule,
      FeatureModule,
      LegalModule,
      AppConfigModule,
      NestjsI18nModule.forRoot({
        fallbackLanguage: 'en',
        loaderOptions: {
          path: path.join(__dirname, '/i18n/locales/'),
        },
        resolvers: [AcceptLanguageResolver],
      }),
      I18nModule,
      PoliciesModule,
      UsersModule,
      AuthModule,
      CaptchaModule,
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

  private initCoreProviders() {
    const providers = Object.keys(defaultProviders)
      .map((token) => getProvider(this.options, token))
      .filter((provider) => !!provider);
    return this.useProviders(...providers);
  }

  private initServeStaticModule() {
    if (!this.options.serveStatic) return this;

    return this.importModules(
      ServeStaticModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService<ConfigurationPath>) => {
          // TODO (serveStatic) provide some defaults...
          return [configService.get('serveStatic')];
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
          const options = { ...configService.get<LyvelyMongoDBOptions>('mongodb') };

          setTransactionSupport(!!options.transactions);
          delete options.transactions;
          delete options.debug;

          options.autoIndex ||= true;
          options.useNewUrlParser ||= true;
          options.useUnifiedTopology ||= true;

          return options;
        },
      }),
    );
  }

  private initConfigModule() {
    const configs = [loadConfig()];
    if (this.options.configFiles) {
      configs.push(...this.options.configFiles.map((file) => loadConfig(file)));
    }

    return this.importModules(
      ConfigModule.forRoot({
        load: configs,
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
      UserRegistrationModule,
      ContentCoreModule,
      ContentStreamModule,
      SystemMessagesModule,
      AccountModule,
      AvatarsModule,
      InvitationsModule,
    );
  }

  private initFeatureModules() {
    if (this.options.useFeatures === false) {
      return this;
    }

    return this.importModules(
      TasksModule,
      HabitsModule,
      MilestonesModule,
      JournalsModule,
      MessageModule,
    );
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