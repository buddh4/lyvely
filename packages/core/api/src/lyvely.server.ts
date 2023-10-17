import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule, JwtAuthGuard } from './auth';
import { ConfigurationPath, ILyvelyCsrfOptions, ServiceExceptionsFilter } from './core';
import { FeaturesModule, FeatureGuard } from './features';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { AppModuleBuilder, IAppModuleBuilderOptions } from './app-module.builder';
import helmet from 'helmet';
import express from 'express';
import http from 'http';
import https from 'https';
import csurf from 'csurf';
import compression from 'compression';
import { useDayJsDateTimeAdapter } from '@lyvely/dates';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import fs from 'fs';
import * as net from 'net';

useDayJsDateTimeAdapter();

interface ILyvelyServerOptions extends IAppModuleBuilderOptions {}

export class LyvelyServer {
  private logger: NestLogger;
  private nestApp: NestExpressApplication;
  private server: express.Express;
  private configService: ConfigService<ConfigurationPath>;
  private options: ILyvelyServerOptions;

  async bootstrap(options: ILyvelyServerOptions = {}) {
    this.options = options;
    this.nestApp = await this.initNestApp();

    this.logger = new NestLogger('main');
    this.configService = this.nestApp.get(ConfigService);

    this.initExpress();
    this.initHelmet();
    this.logInitConfig();
    this.initMongoose();
    this.initCors();
    this.initGuards();
    this.initCookieParser();
    this.initCsrf();
    this.initCompression();
    this.initGlobalPipes();
    this.initGlobalFilters();
    await this.initServer();
  }

  private initExpress() {
    this.nestApp.setGlobalPrefix('api');

    //this.nestApp.useLogger(this.nestApp.get(Logger));
    this.nestApp.use((req, res, next) => {
      const clientIP = req.headers['x-real-ip'] || req.ip;

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

    const tls = this.configService.get<https.ServerOptions>('http.tls');
    if (tls) {
      const port = this.configService.get('http.port', 443);
      if (typeof tls.key === 'string') tls.key = fs.readFileSync(tls.key);
      if (typeof tls.cert === 'string') tls.cert = fs.readFileSync(tls.cert);
      https.createServer(this.configService.get('http.tls'), this.server).listen(port);
    } else {
      const port = this.configService.get('http.port', 8080);
      http.createServer(this.server).listen(port);
    }
  }

  private async initNestApp() {
    this.server = express();
    return NestFactory.create<NestExpressApplication>(
      new AppModuleBuilder(this.options).build(),
      new ExpressAdapter(this.server),
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
    const cookie = this.configService.get<ILyvelyCsrfOptions>('csrf', {});
    cookie.name ||= 'csrf-token';
    cookie.sameSite ||= 'lax';
    cookie.httpOnly = cookie.httpOnly !== false;
    cookie.secure =
      typeof cookie.secure === 'boolean' ? cookie.secure : !!this.configService.get('http.tls');
    this.nestApp.use(csurf({ cookie }));
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
    mongoose.Schema.Types.String.set('trim', true);
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
    const featureGuard = this.nestApp.select(FeaturesModule).get(FeatureGuard);
    this.nestApp.useGlobalGuards(authGuard, featureGuard);
  }

  private initCors() {
    // Cors not required if staticServe is used
    let cors = this.configService.get<CorsOptions>('http.cors');
    const staticServe = !!this.configService.get('serveStatic');

    if (!cors && !staticServe) {
      cors = { origin: this.configService.get('http.appUrl') };
    }

    if (!cors && !staticServe) {
      this.logger.warn(
        'Not cors origin and no serve static configuration set, this is probably a misconfiguration.',
      );
    }

    if (!cors) {
      this.logger.log(`No cors mode configured.`);
      return;
    }

    this.logger.log('Using cors origin', cors);

    cors.credentials = cors.credentials !== false;
    cors.methods ||= ['GET', 'POST', 'PUT'];
    cors.exposedHeaders ||= ['set-cookie'];
    cors.allowedHeaders ||= [
      'Accept-Language',
      'x-visitor-id',
      'x-captcha-identity',
      'x-captcha-token',
      'csrf-token',
      'access-control-allow-origin',
      'content-type',
      'cookie',
    ];
    //allowedHeaders: 'access-control-allow-originaccept,Accept-Language,Content-Language,Content-Type,Authorization,Cookie,X-Requested-With,Origin,Host'

    this.nestApp.enableCors(cors);
  }
}
