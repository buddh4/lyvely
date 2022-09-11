import { ContentMetadata } from '../schemas';

export interface AssertContentMetadata {
  assertContentMetadata(metadata: ContentMetadata): ContentMetadata;
}

export function implementsAssertContentMetadata(content: any): content is AssertContentMetadata {
  return typeof (content as AssertContentMetadata).assertContentMetadata === 'function';
}