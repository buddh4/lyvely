import { DocumentTypeTransformation } from '@/core';
import type { Content } from './content.schema';

/**
 * Represents an abstract class for content transformations.
 * @template TVersions The type of content versions.
 * @template TTarget The type of target content versions.
 * @template TFrom The type of source content versions.
 */
export abstract class ContentTransformation<
  TVersions extends Content = Content,
  TTarget extends TVersions = TVersions,
  TFrom extends Content = Content,
> extends DocumentTypeTransformation<TVersions, TTarget, TFrom> {}
