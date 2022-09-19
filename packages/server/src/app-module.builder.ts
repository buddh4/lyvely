import { Type, DynamicModule, ForwardReference } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule } from "./core/core.module";
import { AuthModule } from "./modules/auth/auth.module";
import { RegisterModule } from "./modules/register/register.module";
import { UsersModule } from "./modules/users";
import { ProfilesModule } from "./modules/profiles";
import { PoliciesModule } from "./modules/policies/policies.module";
import { ContentModule } from "./modules/content";
import { ActivitiesModule } from "./modules/activities/activities.module";
import { TagsModule } from "./modules/tags/tags.module";
import { Module } from '@nestjs/common';
import { ConfigModule , ConfigService } from '@nestjs/config';
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import configuration from "./core/config/configuration";

type Import =  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

interface AppModuleBuilderOptions {
  useRecommended?: boolean,
  useFeatures?: boolean,
  configFiles?: Array<string>,
  serveStatic?: ServeStaticModuleOptions
}

export class AppModuleBuilder {
  private readonly imports: Array<Import>;
  private options: AppModuleBuilderOptions;

  constructor(options: AppModuleBuilderOptions = {}) {
    this.imports = [];
    this.options = options;

    this.initCoreModules()
        .initConfigModule()
        .initServeStaticModule()
        .initMongooseModule()
        .initMailModule()
        .initRecommendedModules()
        .initFeatureModules();
  }

  private initServeStaticModule() {
    if(!this.options.serveStatic) {
      return this;
    }

    return this.importModules(ServeStaticModule.forRoot(this.options.serveStatic));
  }

  private initMongooseModule() {
    return this.importModules(MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb.uri'),
        autoIndex: true,
      }),
      inject: [ConfigService],
    }))
  }

  private initMailModule() {
    // https://nest-modules.github.io/mailer/docs/mailer
    const module = MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          jsonTransport: true
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: true,
        template: {
          dir: process.cwd() + '/template/',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        }
      })
    });

    module.global = true;

    return this.importModules(module);
  }

  private initConfigModule() {
    const configs = [configuration()];
    if(this.options.configFiles) {
      configs.push(...this.options.configFiles.map(file => configuration(file)));
    }
    configs.push(configuration());

    return this.importModules(ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }));
  }

  private initCoreModules() {
    return this.importModules(
      EventEmitterModule.forRoot({ wildcard: true }),
      CoreModule,
      PoliciesModule,
      UsersModule,
      AuthModule,
    )
  }

  private initRecommendedModules() {
    if(this.options.useRecommended === false) {
      return this;
    }

    return this.importModules(
      ProfilesModule,
      TagsModule,
      RegisterModule,
      ContentModule,
      ActivitiesModule,
      TagsModule
    )
  }

  private initFeatureModules() {
    if(this.options.useFeatures === false) {
      return this;
    }

    return this.importModules(
      ActivitiesModule,
    )
  }

  public importModules(...module: Array<Import>) {
    this.imports.push(...module);
    return this;
  }

  public build() {
    @Module({imports: this.imports})
    class AppModule {}
    return AppModule;
  }
}
