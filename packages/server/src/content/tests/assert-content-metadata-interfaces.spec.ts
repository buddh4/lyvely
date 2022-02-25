import { Content, ContentMetadata } from '../schemas';
import { expect } from '@jest/globals';
import { AssertContentMetadata } from '../interfaces';

describe('Content Model', () => {

  class AssertMetadataContent extends Content<AssertMetadataContent> implements AssertContentMetadata {
    assertContentMetadata(metadata: ContentMetadata): ContentMetadata {
      metadata.isArchivable = false;
      return metadata;
    }
  }

  describe('AssertContentMetadata', () => {
    it('assertion is set by default', async() => {
      const content = new AssertMetadataContent();
      expect(content.metaData.isArchivable).toEqual(false);
    });

    it('constructor can not overwrite assertion', async() => {
      const content = new AssertMetadataContent({ metaData: { isArchivable: true }});
      expect(content.metaData.isArchivable).toEqual(false);
    });
  });
});
