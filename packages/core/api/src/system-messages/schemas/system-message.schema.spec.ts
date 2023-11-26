import { ProfileTestDataUtils } from '@/profiles';
import { SystemMessage } from '@/system-messages';
import { instanceToPlain } from 'class-transformer';
import { StreamResponse } from '@lyvely/interface';

describe('SystemMessage', () => {
  describe('transform', () => {
    it('single system message', () => {
      const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
      const systemMessage = new SystemMessage(profile, user, { content: { text: 'test.message' } });
      const transformed = instanceToPlain(systemMessage);
      expect(transformed.content.text).toEqual('test.message');
    });

    it('stream response transformation', () => {
      const { user, profile } = ProfileTestDataUtils.createDummyUserAndProfile();
      const systemMessage = new SystemMessage(profile, user, { content: { text: 'test.message' } });
      const response = new StreamResponse({ models: [systemMessage.toModel()] });
      const transformed = instanceToPlain(response);
      expect(transformed.models[0].content.text).toEqual('test.message');
    });
  });
});
