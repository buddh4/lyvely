import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesModule } from './activities/activities.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule , ConfigService } from '@nestjs/config';

import { CalendarModule } from './calendar/calendar.module';
import { StatisticsModule } from './statistics/statistics.module';
//import { JournalModule } from './journal/journal.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CategoriesModule } from './categories/categories.module';
import { ProfilesModule } from './profiles/profiles.module';
import { RegisterModule } from './register/register.module';
import { UserDao } from './users/daos/user.dao';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import Joi from 'joi';
import { PoliciesModule } from './policies/policies.module';
import { ContentModule } from './content/content.module';
import { CoreModule } from './core/core.module';

const SameSiteSchema = Joi.string().valid('lax', 'strict', 'none').default('lax');

const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'e2e').default('development'),
  PORT: Joi.number().default(3000).default(8080),
  MONGODB_URI: Joi.string().default('mongodb://localhost/lyvely'),
  MONGO_LOG: Joi.boolean().default(false),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().min(64).required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().default('15m'),
  JWT_ACCESS_COOKIE_SAMESITE: SameSiteSchema,
  JWT_REFRESH_TOKEN_SECRET: Joi.string().min(64).required(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().default('200d'),
  JWT_REFRESH_COOKIE_SAMESITE: SameSiteSchema,
  JWT_COOKIES_SECURE: Joi.boolean().default(true),
  CORS_ORIGIN: Joi.string(),
})

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({
      validationSchema: configSchema,
      load: [],
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}.env`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({ wildcard: true }),
    CoreModule,
    AuthModule,
    RegisterModule,
    UsersModule,
    ProfilesModule,
    PoliciesModule,
    CalendarModule,
    ContentModule,
    ActivitiesModule,
    //StatisticsModule,
    //JournalModule,
    //CategoriesModule,
  ],
  providers: [UserDao],
  controllers: [AppController],
})
export class AppModule {}
