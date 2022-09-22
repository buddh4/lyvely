import { Type, DynamicModule, ForwardReference } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CoreModule } from "./modules/core/core.module";
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
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import configuration from "./modules/core/config/configuration";
import { ConfigurationPath } from "./modules/core";
import { setTransactionSupport } from "./modules/core/db/transaction.util";
import { MailsModule } from "./modules/mails/mails.module";

type Import =  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference;

interface AppModuleBuilderOptions {
  useRecommended?: boolean,
  useFeatures?: boolean,
  configFiles?: Array<string>,
  serveStatic?: boolean
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
        .initRecommendedModules()
        .initFeatureModules();
  }

  private initServeStaticModule() {
    if(!this.options.serveStatic) {
      return this;
    }

    return this.importModules(ServeStaticModule.forRootAsync(({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigurationPath>) => {
        // TODO (serveStatic) provide some defaults...
        return configService.get('serveStatic');
      }
    })));
  }

  private initMongooseModule() {
    return this.importModules(MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigurationPath>) => {
        setTransactionSupport(configService.get('mongodb.transactions', false))
        return {
          uri: configService.get('mongodb.uri'),
          autoIndex: true
        }
      },
    }))
  }

  private initConfigModule() {
    const configs = [configuration()];
    if(this.options.configFiles) {
      configs.push(...this.options.configFiles.map(file => configuration(file)));
    }

    return this.importModules(ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }));
  }

  private initCoreModules() {
    return this.importModules(
      EventEmitterModule.forRoot({ wildcard: true }),
      MailsModule.fromConfig(),
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
