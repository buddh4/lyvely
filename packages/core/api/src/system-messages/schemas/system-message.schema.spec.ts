import { ProfileTestDataUtils } from '@/profiles';
import { SystemMessage, SystemMessageContent } from '@/system-messages';
import { instanceToPlain } from 'class-transformer';
import { StreamResponse } from '@lyvely/interface';

describe('SystemMessage', () => {
  describe('transform', () => {
    it('single system message', () => {
      const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
      const systemMessage = new SystemMessage(profile, user, {
        content: new SystemMessageContent({ text: 'test.message' }),
      });
      const transformed = instanceToPlain(systemMessage);
      expect(transformed.content.text).toEqual('test.message');
    });

    it('stream response transformation', () => {
      const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
      const systemMessage = new SystemMessage(profile, user, {
        content: new SystemMessageContent({ text: 'test.message' }),
      });
      const response = new StreamResponse({ models: [systemMessage.toModel()], state: {} });
      const transformed = instanceToPlain(response);
      expect(transformed.models[0].content.text).toEqual('test.message');
    });
  });
});
