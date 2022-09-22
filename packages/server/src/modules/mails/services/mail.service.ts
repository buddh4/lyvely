import { Injectable } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from "nodemailer";
import { ConfigurationPath, LyvelyMailOptions } from "../../core";
import { ConfigService } from '@nestjs/config';
import fs from 'fs';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<ConfigurationPath>
  ) {}

  async sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo> {
    return this.mailerService.sendMail(sendMailOptions)
      .then((info: SentMessageInfo) => {
        const mailConfig = this.configService.get<LyvelyMailOptions>('mail');

        if(mailConfig.createMessageFiles && typeof info.message === 'string') {
          const messagePath = mailConfig.messagesPath || `${process.cwd()}/mail/messages`;
          if (!fs.existsSync(messagePath)) fs.mkdirSync(messagePath, { recursive: true });
          console.log(`${messagePath}/${info.messageId}.json`);
          fs.writeFile(`${messagePath}/${info.messageId}.json`, info.message, 'utf8', () => {});
        }
        return info;
      });
  }

}
