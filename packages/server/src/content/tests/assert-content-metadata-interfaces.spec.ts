import { Content, ContentMetadata } from '../schemas';
import { expect } from '@jest/globals';
import { AssertContentMetadata } from '../interfaces';
import { TestDataUtils } from "../../test/utils/test-data.utils";

describe('Content Model', () => {

  class AssertMetadataContent extends Content<AssertMetadataContent> implements AssertContentMetadata {
    assertContentMetadata(metadata: ContentMetadata): ContentMetadata {
      metadata.isArchivable = false;
      return metadata;
    }
  }

  describe('AssertContentMetadata', () => {
    it('assertion is set by default', async() => {
      const { user, profile } = TestDataUtils.createDummyUserAndProfile();
      const content = new AssertMetadataContent(user, profile);
      expect(content.metaData.isArchivable).toEqual(false);
    });

    it('constructor can not overwrite assertion', async() => {
      const { user, profile } = TestDataUtils.createDummyUserAndProfile();
      const content = new AssertMetadataContent(user, profile, { metaData: { isArchivable: true }});
      expect(content.metaData.isArchivable).toEqual(false);
    });
  });
});
