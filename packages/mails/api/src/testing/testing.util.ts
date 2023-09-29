import { createCoreTestingModule, LyvelyTestBuilder, TestPlugin } from '@lyvely/testing';
import { TestingModuleBuilder } from '@nestjs/testing';
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
};

export function createMailTestingModule(key: string): TestingModuleBuilder {
  return createCoreTestingModule(key, [], [], [MailsModule.fromConfig()])
    .overrideProvider(MailService)
    .useClass(TestMailService);
}
