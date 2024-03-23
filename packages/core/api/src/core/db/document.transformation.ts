import type { BaseDocument } from './base.document';
import type { LeanDoc } from './lean-doc.interface';

/**
 * Represents an interface for simple document transformation.
 * A document transformation is used within the dao layer and can be used to implement simple adjustments/migrations
 * of documents.
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
export interface IDiscriminatorTransformation<
  TVersions extends BaseDocument,
  TTarget extends BaseDocument = TVersions,
  TFrom extends BaseDocument = TVersions,
> extends IDocumentTransformation<TVersions, TTarget, TFrom> {
  discriminator: string;
  getId(): string;
  condition(leanDoc: LeanDoc<TVersions>): boolean;
  transform(leanDoc: LeanDoc<TFrom>): LeanDoc<TTarget>;
}

/**
 * Represents an abstract class for implementing a discriminator transformation.
 *
 * @template TVersions - The base document type which this discriminator transformation supports.
 * @template TTarget - The target document type after transformation (defaults to TVersions).
 * @template TFrom - The source document type before transformation (defaults to TVersions).
 */
export abstract class DiscriminatorTransformation<
  TVersions extends BaseDocument,
  TTarget extends BaseDocument = TVersions,
  TFrom extends BaseDocument = TVersions,
> implements IDiscriminatorTransformation<TVersions, TTarget, TFrom>
{
  abstract discriminator: string;
  abstract getId(): string;
  abstract getDiscriminator(leanDoc: LeanDoc<TVersions>): string;
  abstract transform(leanDoc: LeanDoc<TFrom>): LeanDoc<TTarget>;
  abstract typedCondition(leanDoc: LeanDoc<TVersions>): boolean;

  condition(leanDoc: LeanDoc<TVersions>): boolean {
    if (this.getDiscriminator(leanDoc) !== this.discriminator) return false;
    return this.typedCondition(leanDoc);
  }
}

/**
 * Represents a special kind of DiscriminatorTransformation for documents with a `type` discriminator field.
 *
 * @typeparam TVersions - The type of versions of the document.
 * @typeparam TTarget - The type of the transformed target document.
 * @typeparam TFrom - The type of the original document to transform from.
 */
export abstract class DocumentTypeTransformation<
  TVersions extends BaseDocument & { type: string },
  TTarget extends BaseDocument & { type: string } = TVersions,
  TFrom extends BaseDocument & { type: string } = TVersions,
> extends DiscriminatorTransformation<TVersions, TTarget, TFrom> {
  override getDiscriminator(leanDoc: LeanDoc<TVersions>): string {
    return leanDoc.type;
  }
}
