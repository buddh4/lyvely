import { Module, Global, DynamicModule } from '@nestjs/common';
import { MailService } from './services';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigService } from '@nestjs/config';
import { LyvelyConfigService } from '@/config';

const DEFAULT_MAIL_CONFIG: MailerOptions = {
  transport: {
    streamTransport: true,
  },
  defaults: {
    from: '"No Reply" <no-reply@localhost>',
  },
  preview: false,
  template: {
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
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
      imports: [MailerModule.forRoot(setDefaults(options))],
    };
  }

  static fromConfig(): DynamicModule {
    return MailsModule.forRootAsync();
  }

  private static forRootAsync(): DynamicModule {
    return {
      module: MailsModule,
      imports: [
        MailerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: LyvelyConfigService) => {
            return setDefaults(configService.get('mail'));
          },
        }),
      ],
    };
  }
}

function setDefaults(options?: MailerOptions) {
  options = options || DEFAULT_MAIL_CONFIG;
  options.template = options.template || {};
  // TODO: use better merge...
  options.template.adapter = options.template.adapter || DEFAULT_MAIL_CONFIG.template?.adapter;
  options.template.dir = options.template.dir || __dirname + '/templates';
  return options || DEFAULT_MAIL_CONFIG;
}
