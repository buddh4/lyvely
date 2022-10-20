export interface IContentMetadata {
  isArchivable?: boolean;
  isDeletable?: boolean;
  isEditable?: boolean;
  isLocked?: boolean;
  isCommentable?: boolean;
  isReactable?: boolean;
  isIssue?: boolean;
}

export interface IAssertContentMetadata {
  assertContentMetadata(metadata: IContentMetadata): IContentMetadata;
}

export function implementsAssertContentMetadata(content: any): content is IAssertContentMetadata {
  return typeof (content as IAssertContentMetadata).assertContentMetadata === 'function';
}
