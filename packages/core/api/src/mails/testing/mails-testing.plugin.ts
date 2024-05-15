import { TestBuilder, ITestPlugin } from '@/testing';
import { TestingModuleBuilder } from '@nestjs/testing';
import { MailsModule } from '../mails.module';
import { MailService } from '../services';
import { TestMailService } from './test-mail.service';

export const mailITestPlugin: ITestPlugin = {
  apply(builder: TestBuilder) {
    builder.imports([MailsModule.fromConfig()]);
  },
  prepare(moduleBuilder: TestingModuleBuilder) {
    moduleBuilder.overrideProvider(MailService).useClass(TestMailService);
  },
  afterEach() {
    TestMailService.reset();
  },
};
