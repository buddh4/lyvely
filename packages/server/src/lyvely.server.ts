import { NestFactory } from '@nestjs/core';
import { Type, INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { FeatureGuard, CoreModule, ServiceExceptionsFilter, ConfigurationPath } from '@/core';
import { AppModuleBuilder, IAppModuleBuilderOptions } from '@/app-module.builder';
import helmet, { HelmetOptions } from 'helmet';
import csurf from 'csurf';
import { useDayJsDateTimeAdapter } from '@lyvely/common';

useDayJsDateTimeAdapter();

interface ILyvelyServerOptions extends IAppModuleBuilderOptions {
  appModule?: Type;
}

export class LyvelyServer {
  private logger: Logger;
  private nestApp: INestApplication;
  private configService: ConfigService<ConfigurationPath>;
  private options: ILyvelyServerOptions;

  async bootstrap(options: ILyvelyServerOptions = {}) {
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
    const appModule = this.options.appModule || new AppModuleBuilder(this.options).build();
    const app = await NestFactory.create(appModule);
    app.setGlobalPrefix('api');
    return app;
  }

  private initHelmet() {
    const helmetConfig = this.configService.get<HelmetOptions | false>('helmet', {});
    if (helmetConfig !== false) {
      this.nestApp.use(helmet(helmetConfig));
    }
  }

  private initCsurf() {
    this.nestApp.use(
      csurf({
        cookie: {
          name: 'csrf-token',
          httpOnly: true,
          // secure: true, TODO: configure
          sameSite: 'lax',
        },
      }),
    );
  }

  private initCookieParser() {
    this.nestApp.use(cookieParser());
  }

  private initGlobalPipes() {
    this.nestApp.useGlobalPipes(new ValidationPipe());
  }

  private initGlobalFilters() {
    this.nestApp.useGlobalFilters(new ServiceExceptionsFilter());
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
  }

  private initGuards() {
    const authGuard = this.nestApp.select(AuthModule).get(JwtAuthGuard);
    const featureGuard = this.nestApp.select(CoreModule).get(FeatureGuard);
    this.nestApp.useGlobalGuards(authGuard, featureGuard);
  }

  private initCors() {
    // Cors not required if staticServe is used
    let cors_origin = this.configService.get('http.cors.origin');
    const staticServe = !!this.configService.get('serveStatic');

    if (!cors_origin && !staticServe) {
      cors_origin = this.configService.get('http.appUrl');
    }

    if (!cors_origin && !staticServe) {
      this.logger.warn('Not cors origin and no serve static configuration set, this is probably a misconfiguration.');
    }

    if (!cors_origin) {
      this.logger.log(`No cors mode configured.`);
      return;
    }

    this.logger.log(`Using cors origin '${cors_origin}'`);

    this.nestApp.enableCors({
      origin: cors_origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT'],
      exposedHeaders: ['set-cookie'],
      allowedHeaders: [
        'x-visitor-id',
        'x-captcha-identity',
        'x-captcha-token',
        'csrf-token',
        'access-control-allow-origin',
        'content-type',
        'cookie',
      ],
      //allowedHeaders: 'access-control-allow-originaccept,Accept-Language,Content-Language,Content-Type,Authorization,Cookie,X-Requested-With,Origin,Host'
    });
  }
}
