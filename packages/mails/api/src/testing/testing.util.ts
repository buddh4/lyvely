import { createCoreTestingModule } from '@lyvely/testing';
import { TestingModuleBuilder } from '@nestjs/testing';
import { MailsModule } from '../mails.module';
import { MailService } from '../services';
import { TestMailService } from './test-mail.service';

export function createMailTestingModule(key: string): TestingModuleBuilder {
  return createCoreTestingModule(key, [], [], [MailsModule.fromConfig()])
    .overrideProvider(MailService)
    .useClass(TestMailService);
}
