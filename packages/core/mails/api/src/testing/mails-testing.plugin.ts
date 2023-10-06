import { LyvelyTestBuilder, TestPlugin } from '@lyvely/testing';
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { MailsModule } from '../mails.module';
import { MailService } from '../services';
import { TestMailService } from './test-mail.service';

export const mailTestPlugin: TestPlugin = {
  apply(builder: LyvelyTestBuilder) {
    builder.imports([MailsModule.fromConfig()]);
  },
  prepare(moduleBuilder: TestingModuleBuilder) {
    moduleBuilder.overrideProvider(MailService).useClass(TestMailService);
  },
  afterEach(testModule: TestingModule) {
    TestMailService.reset();
  },
};