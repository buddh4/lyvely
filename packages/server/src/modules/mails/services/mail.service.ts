import { Injectable, Logger } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from "nodemailer";
import { ConfigurationPath, LyvelyMailOptions } from "../../core";
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { Stream } from "stream";

export interface MessageInfo {
  messageId: string,
  message: unknown,
}

export interface StreamMessageInfo extends MessageInfo {
  messageId: string
  message: Stream
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<ConfigurationPath>
  ) {
  }

  async sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo> {
    return this.mailerService.sendMail(sendMailOptions).then((info: SentMessageInfo) => {
      return this.handleSentMessageInfo(info);
    });
  }

  public getMessageFileDir() {
    return this.configService.get<LyvelyMailOptions>('mail').messagesPath || `${process.cwd()}/mail/messages`;
  }

  public getMessageFilePath(info: SentMessageInfo) {
    const messageId = this.getMessageId(info);
    const extension = this.isJsonTransport(info) ? `json` : this.isStreamTransport(info) ? 'eml' : '';
    return `${this.getMessageFileDir()}/${messageId}.${extension}`;
  }

  private handleSentMessageInfo(info: SentMessageInfo) {
    if (!this.isCreateMessageFile()) return info;

    try {
      if (this.isStreamTransport(info)) {
        this.saveStreamMessageToFile(info);
      } else if (this.isJsonTransport(info)) {
        this.saveJsonMessageToFile(info);
      }
    } catch (e) {
      this.logger.error('Could not create mail message file.');
      this.logger.error(e);
    }

    return info;
  }

  private isCreateMessageFile() {
    return this.configService.get<LyvelyMailOptions>('mail').createMessageFiles;
  }

  private isStreamTransport(info: SentMessageInfo): info is StreamMessageInfo {
    const mailConfig = this.configService.get<LyvelyMailOptions>('mail');
    return typeof mailConfig.transport === 'object'
      && 'streamTransport' in mailConfig.transport
      && mailConfig.transport.streamTransport
      && info.message instanceof Stream;
  }

  private isJsonTransport(info: SentMessageInfo) {
    const mailConfig = this.configService.get<LyvelyMailOptions>('mail');
    return typeof mailConfig.transport === 'object'
      && 'jsonTransport' in mailConfig.transport
      && mailConfig.transport.jsonTransport
      && typeof info.message === 'string';
  }

  private getMessageId(rawIdOrMessageInfo: string | SentMessageInfo) {
    const rawId = typeof rawIdOrMessageInfo === 'string' ? rawIdOrMessageInfo : rawIdOrMessageInfo.messageId;
    return rawId.replace(/[<>]/g, '');
  }

  private saveStreamMessageToFile(info: StreamMessageInfo) {
    info.message.pipe(fs.createWriteStream(this.initMessageFilePath(info)));
  }

  private saveJsonMessageToFile(info: SentMessageInfo) {
    fs.writeFile(this.initMessageFilePath(info), info.message, 'utf8', () => {});
  }

  private initMessageFilePath(info: SentMessageInfo) {
    const messagePath = this.getMessageFileDir();
    if (!fs.existsSync(messagePath)) fs.mkdirSync(messagePath, { recursive: true });
    return this.getMessageFilePath(info);
  }
}
