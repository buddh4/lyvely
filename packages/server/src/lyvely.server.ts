import { NestFactory } from '@nestjs/core';
import { Type } from '@nestjs/common';
import { INestApplication, ValidationPipe , Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from './core/filters/AllExceptionsFilter';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { CoreModule } from './core/core.module';
import { FeatureGuard } from './core/features/feature.guard';
import { AppModuleBuilder } from "./app-module.builder";
import helmet from "helmet";
import csurf from 'csurf';
import { HelmetOptions } from "helmet";

interface LyvelyServerOptions {
  appModule?: Type<any>;
}

export class LyvelyServer {
  private logger: Logger;
  private nestApp: INestApplication;
  private configService: ConfigService;
  private options: LyvelyServerOptions;

  async bootstrap(options: LyvelyServerOptions = {}) {
    this.options = options;
    this.nestApp = await this.initNestApp();

    this.logger = new Logger('main');
    this.configService = this.nestApp.get(ConfigService);

    this.initHelmet();
    this.logInitConfig();
    this.initMongoose();
    this.initCors();
    this.initGuards();
    this.initCookieParser();
    this.initCsurf();

    this.initGlobalPipes();
    this.initGlobalFilters();

    await this.nestApp.listen(this.configService.get('http.port'));
  }

  private async initNestApp() {
    const appModule = this.options.appModule || new AppModuleBuilder().build();
    return await NestFactory.create(appModule);
  }

  private initHelmet() {
    const helmetConfig = this.configService.get<HelmetOptions|false>('helmet', {});
    this.logger.log('Using helmet options:', helmetConfig);
    if(helmetConfig !== false) {
      this.nestApp.use(helmet(helmetConfig));
    }
  }

  private initCsurf() {
    this.nestApp.use(csurf({
      cookie: true
    }));
  }

  private initCookieParser() {
    this.nestApp.use(cookieParser());
  }

  private initGlobalPipes() {
    this.nestApp.useGlobalPipes(new ValidationPipe());
  }

  private initGlobalFilters() {
    this.nestApp.useGlobalFilters(new AllExceptionsFilter());
  }

  private initMongoose() {
    mongoose.set('debug', !!this.configService.get('mongodb.debug'));
  }

  private logInitConfig() {
    const port = this.configService.get('http.port');
    const mongodb_uri = this.configService.get('mongodb.uri');

    this.logger.log(`Using port '${port}'`);

    this.logger.log(`Using mongodb uri '${mongodb_uri}'`);

    this.logger.log(`Using NODE_ENV '${process.env.NODE_ENV}'`);
    this.logger.log(
      `Using env file '${this.configService.get('NODE_ENV') ? '.' + this.configService.get('NODE_ENV') : ''}.env'`,
    );
  }

  private initGuards() {
    const authGuard = this.nestApp.select(AuthModule).get(JwtAuthGuard);
    const featureGuard = this.nestApp.select(CoreModule).get(FeatureGuard);
    this.nestApp.useGlobalGuards(authGuard, featureGuard);
  }

  private initCors() {
    const cors_origin = this.configService.get('http.cors.origin');

    if(cors_origin) {
      this.logger.log(`Using cors origin '${cors_origin}'`);
    } else {
      this.logger.log(`No cors mode`);
    }

    this.nestApp.enableCors({
      origin: cors_origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT'],
      exposedHeaders: ['set-cookie'],
      allowedHeaders: [
        'x-visitor-id',
        'csrf-token',
        'access-control-allow-origin',
        'content-type',
        'cookie'
      ],
      //allowedHeaders: 'access-control-allow-originaccept,Accept-Language,Content-Language,Content-Type,Authorization,Cookie,X-Requested-With,Origin,Host'
    });
  }
}
