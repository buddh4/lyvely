import { MailService } from './mail.service';
import fs from 'fs';
import { buildTest, ILyvelyTestingModule } from '@/testing';
import { mailITestPlugin } from '../testing';

describe('MailService', () => {
  let testingModule: ILyvelyTestingModule;
  let mailService: MailService;

  const TEST_KEY = 'membership_dao';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([mailITestPlugin]).compile();
    mailService = testingModule.get(MailService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  describe('Test json file output', () => {
    it('test simple mail info', async () => {
      const info = await mailService.sendMail({
        to: 'test@test.de',
        subject: 'Testing...',
        html: '<b>Testing...</b>',
      });

      expect(info).toBeDefined();
      expect(info.message).toBeDefined();
      const message = JSON.parse(info.message);
      expect(message.from.address).toEqual('no-reply@test');
      expect(message.from.name).toEqual('No Reply');
      expect(message.to).toBeDefined();
      expect(message.to[0].address).toEqual('test@test.de');
      expect(message.subject).toEqual('Testing...');
    });

    it('assure test mail file is created', async () => {
      const info = await mailService.sendMail({
        to: 'test@test.de',
        subject: 'Testing...',
        html: '<b>Testing...</b>',
      });

      expect(info.messageFile).toBeDefined();
      await info.messageFile;
      expect(fs.existsSync(mailService.getMessageFilePath(info))).toEqual(true);
    });
  });
});
