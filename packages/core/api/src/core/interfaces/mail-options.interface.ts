import { MailerOptions } from '@nestjs-modules/mailer';

export type IMailOptions = MailerOptions & {
  createMessageFiles?: boolean;
  messagesPath?: string;
  footerText?: string;
  footerSubtext?: string;
  logoImageUrl?: string;
  unsubscribeLabel?: string;
};
