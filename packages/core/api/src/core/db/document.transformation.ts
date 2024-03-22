import type { BaseDocument } from './base.document';
import type { LeanDoc } from './lean-doc.interface';

/**
 * Represents an interface for simple document transformation.
 * A document transformation is used within the dao layer and can be used to implement simple adjustments/migrations
 * of documents.
 *
 * Note: The transformation is applied directly on the lean document.
 *
 * @interface
 * @template TDocument - The type of the document that will be transformed.
 */
export interface IDocumentTransformation<
  TVersions extends BaseDocument,
  TTarget extends BaseDocument = TVersions,
  TFrom extends BaseDocument = TVersions,
> {
  getId(): string;
  condition(leanDoc: LeanDoc<TVersions>): boolean;
  transform(leanDoc: LeanDoc<TFrom>): LeanDoc<TTarget>;
}
