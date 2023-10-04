import { Injectable, Logger } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { ISendMailOptions, MailService } from '../services';

@Injectable()
export class TestMailService extends MailService {
  protected readonly logger = new Logger(TestMailService.name);

  static sentMailOptions: ISendMailOptions[] = [];
  static messageInfos: SentMessageInfo[] = [];

  async sendMail(
    sendMailOptions: ISendMailOptions,
  ): Promise<SentMessageInfo & { messageFile?: Promise<void> }> {
    TestMailService.sentMailOptions.push(sendMailOptions);

    const result = await super.sendMail(sendMailOptions);
    TestMailService.messageInfos.push(result);
    return result;
  }

  static reset() {
    TestMailService.sentMailOptions = [];
    TestMailService.messageInfos = [];
  }
}
