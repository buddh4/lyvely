import csurf from 'csurf';
import { NestFactory } from '@nestjs/core';
import { Logger as NestLogger, VersioningType, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Headers } from '@lyvely/interface';
import { AuthModule, RootAuthGuard } from '../auth';
import { BaseUserGuard } from '../users';
import { ServiceExceptionsFilter } from '@/core';
import { FeatureGuard, FeaturesModule } from '../features';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { AppModuleBuilder, IAppModuleBuilderOptions } from '../app-module.builder';
import helmet from 'helmet';
import express from 'express';
import http from 'http';
import https from 'https';
import compression from 'compression';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import fs from 'fs';
import * as net from 'net';
import { MulterConfigFactory } from '@/files';
import { mkdir } from 'node:fs/promises';
import { LyvelyConfigService } from '@/config';

useDayJsDateTimeAdapter();

interface ILyvelyServerOptions extends IAppModuleBuilderOptions {}

export class LyvelyServer {
  private logger: NestLogger;
  private nestApp: NestExpressApplication;
  private server: express.Express;
  private configService: LyvelyConfigService;
  private options: ILyvelyServerOptions;

  async bootstrap(options: ILyvelyServerOptions = {}) {
    this.options = options;
    this.nestApp = await this.createtNestApp();

    this.logger = new NestLogger('main');
    this.configService = this.nestApp.get(LyvelyConfigService);

    await this.createPaths();
    this.initVersioning();
    this.initExpress();
    this.initHelmet();
    this.logInitConfig();
    this.initMongoose();
    this.initCors();
    this.initGuards();
    this.initCookieParser();
    this.initCsrf();
    this.initCompression();
    this.initGlobalFilters();
    await this.initServer();
  }

  private initVersioning() {
    this.nestApp.enableVersioning({
      defaultVersion: VERSION_NEUTRAL,
      type: VersioningType.HEADER,
      header: Headers.X_API_VERSION,
    });
  }

  private initExpress() {
    this.nestApp.setGlobalPrefix('api');

    //this.nestApp.useLogger(this.nestApp.get(Logger));
    this.nestApp.use((req, res, next) => {
      const clientIP = req.header('x-real-ip') || req.ip;

      if (!net.isIP(clientIP)) {
        // handle invalid IP address
        return res.status(400).send('Invalid IP address');
      }

      next();
    });
    this.nestApp.set('trust proxy', this.configService.get('http.trustProxy', false));
  }

  private async initServer() {
    await this.nestApp.init();

    const tls = this.configService.get('http.tls');
    if (tls) {
      const port = this.configService.get('http.port', 443);
      if (typeof tls.key === 'string') tls.key = fs.readFileSync(tls.key);
      if (typeof tls.cert === 'string') tls.cert = fs.readFileSync(tls.cert);
      https.createServer(tls, this.server).listen(port);
    } else {
      const port = this.configService.get('http.port', 8080);
      http.createServer(this.server).listen(port);
    }
  }

  private async createtNestApp() {
    this.server = express();
    return NestFactory.create<NestExpressApplication>(
      await new AppModuleBuilder(this.options).build(),
      new ExpressAdapter(this.server)
    );
  }

  private initHelmet() {
    const helmetConfig = this.configService.get('helmet', {});
    if (helmetConfig !== false) {
      this.nestApp.use(helmet(helmetConfig));
    }
  }

  private initCompression() {
    const compressionOptions = this.configService.get('http.compression', {});
    if (compressionOptions !== false) {
      const options = typeof compressionOptions === 'boolean' ? {} : compressionOptions;
      this.nestApp.use(compression(options));
    }
  }

  private initCsrf() {
    const csrfConfig = this.configService.get('csrf');

    if (csrfConfig?.enabled === false) {
      this.logger.warn('Csrf is disabled');
      return;
    }

    const cookie = {
      name: 'csrf-token',
      sameSite: 'lax',
      httpOnly: true,
      secure: !!this.configService.get('http.tls'),
      ...csrfConfig,
    };

    this.logger.log('Use csrf cookie:');
    this.logger.log(cookie);

    this.nestApp.use(csurf({ cookie }));
  }

  private initCookieParser() {
    this.nestApp.use(cookieParser());
  }

  private initGlobalFilters() {
    this.nestApp.useGlobalFilters(new ServiceExceptionsFilter());
  }

  private initMongoose() {
    mongoose.set('debug', this.configService.get('mongodb.debug', false));
    mongoose.Schema.Types.String.set('trim', true);
  }

  private logInitConfig() {
    const host = this.configService.get('http.host');
    const port = this.configService.get('http.port');
    const mongodb_uri = this.configService.get('mongodb.uri');

    this.logger.log(`Using host '${host}'`);
    this.logger.log(`Using port '${port}'`);
    this.logger.log(`Using mongodb uri '${mongodb_uri}'`);
    this.logger.log(`Using NODE_ENV '${process.env.NODE_ENV}'`);
  }

  private initGuards() {
    const authGuard = this.nestApp.select(AuthModule).get(RootAuthGuard);
    const featureGuard = this.nestApp.select(FeaturesModule).get(FeatureGuard);
    const userGuard = this.nestApp.select(FeaturesModule).get(BaseUserGuard);
    this.nestApp.useGlobalGuards(authGuard, userGuard, featureGuard);
  }

  private initCors() {
    // Cors not required if staticServe is used
    let cors = this.configService.get('http.cors');
    const staticServe = this.options.serveStatic;

    if (!cors && !staticServe) {
      cors = { origin: this.configService.get('http.appUrl') };
    }

    if (!cors && !staticServe) {
      this.logger.warn(
        'Not cors origin and no serve static configuration set, this is probably a misconfiguration.'
      );
    }

    if (!cors) {
      this.logger.log(`No cors mode configured.`);
      return;
    }

    this.logger.log(`Using cors origin ${cors.origin}`);

    cors.credentials = cors.credentials !== false;
    cors.methods ||= ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    cors.exposedHeaders ||= ['set-cookie'];

    cors.allowedHeaders ||= [
      'Accept-Language',
      'csrf-token',
      'access-control-allow-origin',
      'content-type',
      'cookie',
    ];

    const allowedHeaders =
      typeof cors.allowedHeaders === 'string'
        ? cors.allowedHeaders.split(',')
        : cors.allowedHeaders || [];

    allowedHeaders.push(
      'Accept-Language',
      'csrf-token',
      'access-control-allow-origin',
      'content-type',
      'cookie'
    );

    Object.keys(Headers).forEach((key) => allowedHeaders.push(Headers[key]));

    cors.allowedHeaders = allowedHeaders;

    this.logger.log('Allow headers:');
    this.logger.log(cors.allowedHeaders);
    //allowedHeaders: 'access-control-allow-originaccept,Accept-Language,Content-Language,Content-Type,Authorization,Cookie,X-Requested-With,Origin,Host'

    this.nestApp.enableCors(cors);
  }

  private async createPaths() {
    const uploadDir = MulterConfigFactory.getUploadDirectoryPath(this.configService);
    this.logger.log(`Setup upload directory: ${uploadDir}`);
    return mkdir(uploadDir, { recursive: true });
  }
}
