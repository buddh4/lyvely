import { Content, ContentMetadata } from '../schemas';
import { expect } from '@jest/globals';
import { IAssertContentMetadata } from '../interfaces';
import { TestDataUtils } from '@/modules/test';

describe('Content Model', () => {
  class AssertMetadataContent extends Content<AssertMetadataContent> implements IAssertContentMetadata {
    assertContentMetadata(metadata: ContentMetadata): ContentMetadata {
      metadata.isArchivable = false;
      return metadata;
    }
  }

  describe('AssertContentMetadata', () => {
    it('assertion is set by default', async () => {
      const { user, profile } = TestDataUtils.createDummyUserAndProfile();
      const content = new AssertMetadataContent(profile, user);
      expect(content.metaData.isArchivable).toEqual(false);
    });

    it('constructor can not overwrite assertion', async () => {
      const { user, profile } = TestDataUtils.createDummyUserAndProfile();
      const content = new AssertMetadataContent(profile, user, { metaData: { isArchivable: true } });
      expect(content.metaData.isArchivable).toEqual(false);
    });
  });
});
