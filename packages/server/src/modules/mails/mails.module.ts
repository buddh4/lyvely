import { Module, Global, DynamicModule } from '@nestjs/common';
import { MailService } from "./services/mail.service";
import { MailerModule, MailerOptions,  } from '@nestjs-modules/mailer';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigurationPath } from "../core";
import { ConfigModule, ConfigService } from '@nestjs/config';

const DEFAULT_MAIL_CONFIG: MailerOptions =  {
  transport: {
    jsonTransport: true
  },
  defaults: {
    from: '"No Reply" <no-reply@localhost>',
  },
  preview: false,
  template: {
    dir: process.cwd() + '/mail/templates/',
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  }
};

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailsModule {
  static forRoot(options?: MailerOptions): DynamicModule {
    return {
      module: MailsModule,
      imports: [MailerModule.forRoot(setDefaults(options))]
    }
  }

  static fromConfig(): DynamicModule {
    return MailsModule.forRootAsync();
  }

  private static forRootAsync(): DynamicModule {
    return {
      module: MailsModule,
      imports: [MailerModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService<ConfigurationPath>) => {
          return setDefaults(configService.get('mail'));
        }
      })]
    }
  }
}

function setDefaults(options?: MailerOptions) {
  options = options || DEFAULT_MAIL_CONFIG;
  // TODO: use better merge...
  options.template.adapter = options.template.adapter || DEFAULT_MAIL_CONFIG.template.adapter;
  options.template.dir = options.template.dir || DEFAULT_MAIL_CONFIG.template.dir;
  return options || DEFAULT_MAIL_CONFIG;
}


