import { Injectable } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from "nodemailer";

@Injectable()
export class LyvelyMailService {
  constructor(private readonly mailerService: MailerService) {}

  /*sendMail(sendMailOptions: ISendMailOptions): Promise<SentMessageInfo> {

  }*/
}
