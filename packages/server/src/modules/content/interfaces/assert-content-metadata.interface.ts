export interface IContentMetadata {
  isArchivable?: boolean;
  isDeletable?: boolean;
  isEditable?: boolean;
  isLocked?: boolean;
  isCommentable?: boolean;
  isReactable?: boolean;
  isIssue?: boolean;
}

export interface AssertContentMetadata {
  assertContentMetadata(metadata: IContentMetadata): IContentMetadata;
}

export function implementsAssertContentMetadata(content: any): content is AssertContentMetadata {
  return typeof (content as AssertContentMetadata).assertContentMetadata === 'function';
}
