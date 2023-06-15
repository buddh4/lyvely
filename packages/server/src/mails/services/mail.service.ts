import { Injectable, Logger } from '@nestjs/common';
import { MailerService, ISendMailOptions as MailerSendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { LyvelyAppConfiguration, LyvelyMailOptions, UrlGenerator } from '@lyvely/server-core';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import { Stream } from 'stream';
import pug from 'pug';
import { escapeHTML, UrlRoute } from '@lyvely/common';

export interface IMessageInfo {
  messageId: string;
  message: unknown;
}

export interface IStreamMessageInfo extends IMessageInfo {
  messageId: string;
  message: Stream;
}

export interface ISendMailOptions extends MailerSendMailOptions {
  partials?: { [n: string]: string | { template: string; context: { [n: string]: any } } };
}

@Injectable()
export class MailService {
  protected readonly logger = new Logger(MailService.name);

  constructor(
    protected readonly mailerService: MailerService,
    protected readonly configService: ConfigService<LyvelyAppConfiguration>,
    protected readonly urlGenerator: UrlGenerator,
  ) {}

  async sendMail(
    sendMailOptions: ISendMailOptions,
  ): Promise<SentMessageInfo & { messageFile?: Promise<void> }> {
    sendMailOptions.template = sendMailOptions.template || 'main';
    this.setDefaultContext(sendMailOptions);
    this.renderPartials(sendMailOptions);
    return this.mailerService.sendMail(sendMailOptions).then((info: SentMessageInfo) => {
      return this.handleSentMessageInfo(info);
    });
  }

  private setDefaultContext(sendMailOptions: ISendMailOptions) {
    const mailConfig = this.configService.get('mail');
    sendMailOptions.context = sendMailOptions.context || {};
    sendMailOptions.context['footerText'] =
      mailConfig.footerText || this.configService.get('appName');
    sendMailOptions.context['footerSubText'] = mailConfig.footerSubtext || '';
    sendMailOptions.context['logoImageUrl'] =
      mailConfig.logoImageUrl ||
      this.urlGenerator.getAppUrl({ path: '/images/mail_default_logo.png' }).href;
    // TODO: translate...
    sendMailOptions.context['unsubscribeLabel'] = mailConfig.unsubscribeLabel || 'unsubscribe';
  }

  private renderPartials(sendMailOptions: ISendMailOptions) {
    if (!sendMailOptions.partials) {
      return;
    }

    for (const variable in sendMailOptions.partials) {
      const value = sendMailOptions.partials[variable];
      if (typeof value === 'string') {
        sendMailOptions.context[variable] = value;
      } else if (value.template) {
        const compileFunction = pug.compileFile(value.template, { cache: true });
        sendMailOptions.context[variable] = compileFunction(value.context);
        if (variable === 'body') {
          sendMailOptions.context['rawBody'] = true;
        }
      }
    }
  }

  public getMessageFileDir() {
    return (
      this.configService.get<LyvelyMailOptions>('mail').messagesPath ||
      `${process.cwd()}/mail/messages`
    );
  }

  public getMessageFilePath(info: SentMessageInfo) {
    const messageId = this.getMessageId(info);
    const extension = this.isJsonTransport(info)
      ? `json`
      : this.isStreamTransport(info)
      ? 'eml'
      : '';
    return `${this.getMessageFileDir()}/${messageId}.${extension}`;
  }

  private handleSentMessageInfo(info: SentMessageInfo & { messageFile?: Promise<void> }) {
    if (!this.isCreateMessageFile()) return info;

    const result: SentMessageInfo & { messageFile?: Promise<void> } = info;

    try {
      if (this.isStreamTransport(info)) {
        result.messageFile = this.saveStreamMessageToFile(info);
      } else if (this.isJsonTransport(info)) {
        result.messageFile = this.saveJsonMessageToFile(info);
      }
    } catch (e) {
      this.logger.error('Could not create mail message file.');
      this.logger.error(e);
    }

    return result;
  }

  private isCreateMessageFile() {
    return this.configService.get<LyvelyMailOptions>('mail').createMessageFiles;
  }

  private isStreamTransport(info: SentMessageInfo): info is IStreamMessageInfo {
    const mailConfig = this.configService.get<LyvelyMailOptions>('mail');
    return (
      typeof mailConfig.transport === 'object' &&
      'streamTransport' in mailConfig.transport &&
      mailConfig.transport.streamTransport &&
      info.message instanceof Stream
    );
  }

  private isJsonTransport(info: SentMessageInfo) {
    const mailConfig = this.configService.get<LyvelyMailOptions>('mail');
    return (
      typeof mailConfig.transport === 'object' &&
      'jsonTransport' in mailConfig.transport &&
      mailConfig.transport.jsonTransport &&
      typeof info.message === 'string'
    );
  }

  private getMessageId(rawIdOrMessageInfo: string | SentMessageInfo) {
    const rawId =
      typeof rawIdOrMessageInfo === 'string' ? rawIdOrMessageInfo : rawIdOrMessageInfo.messageId;
    return rawId.replace(/[<>]/g, '');
  }

  private saveStreamMessageToFile(info: IStreamMessageInfo) {
    return new Promise((resolve, reject) => {
      info.message
        .pipe(fs.createWriteStream(this.initMessageFilePath(info)))
        .on('end', resolve)
        .on('error', reject);
    });
  }

  private saveJsonMessageToFile(info: SentMessageInfo) {
    return new Promise((resolve) => {
      fs.writeFile(this.initMessageFilePath(info), info.message, 'utf8', resolve);
    });
  }

  private initMessageFilePath(info: SentMessageInfo) {
    const messagePath = this.getMessageFileDir();
    if (!fs.existsSync(messagePath)) fs.mkdirSync(messagePath, { recursive: true });
    return this.getMessageFilePath(info);
  }

  getEscapedAppUrl(route: UrlRoute) {
    return escapeHTML(encodeURI(this.urlGenerator.getAppUrl(route).href));
  }

  getEscapedApiUrl(route: UrlRoute) {
    return escapeHTML(encodeURI(this.urlGenerator.getApiUrl(route).href));
  }
}
