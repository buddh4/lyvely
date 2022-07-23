import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe , Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllExceptionsFilter } from './core/filters/AllExceptionsFilter';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { CoreModule } from './core/core.module';
import { FeatureGuard } from './core/features/feature.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('main');
  const configService = app.get(ConfigService);

  logInitConfig(configService, logger);

  initMongoose(configService);
  initCors(app, configService, logger);
  initGuards(app);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());
  await app.listen(configService.get('PORT'));
}

function initMongoose(configService: ConfigService) {
  mongoose.set('debug', !!configService.get('MONGO_LOG'));
}

function logInitConfig(configService: ConfigService,  logger: Logger) {
  const port = configService.get('PORT');
  const mongodb_uri = configService.get('MONGODB_URI');

  logger.log(`Using port '${port}'`);

  logger.log(`Using mongodb uri '${mongodb_uri}'`);

  logger.log(`Using NODE_ENV '${process.env.NODE_ENV}'`);
  logger.log(
    `Using env file '${configService.get('NODE_ENV') ? '.' + configService.get('NODE_ENV') : ''}.env'`,
  );
}

function initGuards(app: INestApplication) {
  const authGuard = app.select(AuthModule).get(JwtAuthGuard);
  const featureGuard = app.select(CoreModule).get(FeatureGuard);
  app.useGlobalGuards(authGuard, featureGuard);
}

function initCors(app: INestApplication, configService: ConfigService, logger: Logger) {
  const cors_origin = configService.get('CORS_ORIGIN');

  if(cors_origin) {
    logger.log(`Using cors origin '${cors_origin}'`);
  } else {
    logger.log(`No cors mode`);
  }

  app.enableCors({
    origin: cors_origin,
    credentials: true,
    methods: ['GET', 'POST'],
    exposedHeaders: ['set-cookie'],
    allowedHeaders: [
      'x-visitor-id',
      'access-control-allow-origin',
      'content-type',
      'cookie'
    ],
    //allowedHeaders: 'access-control-allow-originaccept,Accept-Language,Content-Language,Content-Type,Authorization,Cookie,X-Requested-With,Origin,Host'
  });
}

bootstrap();
