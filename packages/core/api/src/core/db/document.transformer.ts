import type { IDocumentTransformation } from './document.transformation';
import type { BaseDocument } from './base.document';
import type { LeanDoc } from './lean-doc.interface';
import { DiscriminatorTransformation } from './document.transformation';

/**
 * Represents an interface for classes responsible for registering and
 * applying multiple transformations to a certain type of document.
 *
 * @template T - The type of base document
 * @template TVersions - The type of document versions
 */
export interface IDocumentTransformer<T extends BaseDocument, TVersions extends BaseDocument> {
  /**
   * Register transformations for documents.
   *
   * @param {IDocumentTransformation<TVersions>[]} transformations - Array of transformations to register.
   * @return {void}
   */
  registerTransformations(...transformations: IDocumentTransformation<TVersions>[]): void;

  /**
   * Returns a transformed version of the lean document or the document itself and a boolean value indicating whether the
   * document was transformed.
   *
   * @param {LeanDoc<TVersions>} lean - The Lean document to be transformed.
   * @return {[LeanDoc<T>, boolean]} - The transformed Lean document along with a boolean value indicating if the transformation was successful.
   */
  transformDocument(lean: LeanDoc<TVersions>): [LeanDoc<T>, boolean];
}

/**
 * Abstract class representing a base document transformer.
 *
 * @template T - The type of the base document.
 * @template TVersions - The type of the base document versions.
 * @implements IDocumentTransformer<T, TVersions>
 */
export abstract class BaseDocumentTransformer<
  T extends BaseDocument,
  TVersions extends BaseDocument,
> implements IDocumentTransformer<T, TVersions>
{
  /**
   * Register transformations for documents.
   *
   * @param {IDocumentTransformation<TVersions>[]} transformations - Array of transformations to register.
   * @return {void}
   */
  abstract registerTransformations(...transformations: IDocumentTransformation<TVersions>[]);

  /**
   * Retrieves the transformations for the given Lean document.
   *
   * @param {LeanDoc<TVersions>} lean - The Lean document for which to retrieve transformations.
   * @return {IDocumentTransformation<TVersions>[]} - An array of document transformations.
   */
  abstract getTransformations(lean: LeanDoc<TVersions>): IDocumentTransformation<TVersions>[];

  /**
   * Returns a transformed version of the lean document or the document itself and a boolean value indicating whether the
   * document was transformed.
   *
   * @param {LeanDoc<TVersions>} lean - The Lean document to be transformed.
   * @return {[LeanDoc<T>, boolean]} - The transformed Lean document along with a boolean value indicating if the transformation was successful.
   */
  transformDocument(lean: LeanDoc<TVersions>): [LeanDoc<T>, boolean] {
    let wasTransformed = false;
    const result = this.getTransformations(lean).reduce((transformed, transformation) => {
      const { _id } = transformed;
      if (transformation.condition(transformed)) {
        wasTransformed = true;
        transformed = transformation.transform(transformed);
        transformed._id = _id;
      }
      return transformed;
    }, lean);

    return [(<unknown>result) as LeanDoc<T>, wasTransformed];
  }
}

/**
 * A simple DocumentTransformer implementation mainly used for document collections without discriminator.
 *
 * @template T - The base document type.
 * @template TVersions - The base document versions type.
 */
export class DocumentTransformer<
  T extends BaseDocument,
  TVersions extends BaseDocument,
> extends BaseDocumentTransformer<T, TVersions> {
  private transformations: IDocumentTransformation<TVersions>[] = [];

  /**
   * Register transformations for documents.
   *
   * @param {IDocumentTransformation<TVersions>[]} transformations - Array of transformations to register.
   * @return {void}
   */
  override registerTransformations(...transformations: IDocumentTransformation<TVersions>[]) {
    this.transformations.push(...transformations);
  }

  /**
   * Retrieves the transformations for the given Lean document.
   *
   * @param {LeanDoc<TVersions>} lean - The Lean document for which to retrieve transformations.
   * @return {IDocumentTransformation<TVersions>[]} - An array of document transformations.
   */
  override getTransformations(lean: LeanDoc<TVersions>): IDocumentTransformation<TVersions>[] {
    return this.transformations;
  }
}

/**
 * Represents an abstract class for transforming documents of collections with a discriminator field.
 * This transformer is preferred for collections with discriminator usage, since it separates generic
 * transformations from specific discriminator related transformations in order to not test a document against
 * all possible transformations.
 *
 * A transformation only relevant for a specific discriminator should be derived from the DiscriminatorTransformation
 * class.
 *
 * @template T - The type of the base document.
 * @template TVersions - The type of the document versions.
 */
export abstract class DiscriminatorDocumentTransformer<
  T extends BaseDocument,
  TVersions extends BaseDocument = T,
> extends BaseDocumentTransformer<T, TVersions> {
  /** Holds instances of generic transformations. **/
  private transformations: IDocumentTransformation<TVersions>[] = [];

  /** Holds instances of discriminator related transformations. **/
  private discriminatorTransformations: Map<string, IDocumentTransformation<TVersions>[]> =
    new Map();

  /** Returns the discriminator value of a given document. **/
  protected abstract getDiscriminator(leanDoc: LeanDoc<TVersions>): string;

  /**
   * Registers document transformations.
   *
   * @param {...IDocumentTransformation<TVersions>} transformations - The transformations to register.
   */
  override registerTransformations(...transformations: IDocumentTransformation<TVersions>[]) {
    transformations.forEach((transformation) => {
      if (transformation instanceof DiscriminatorTransformation) {
        let transformations = this.discriminatorTransformations.get(transformation.discriminator);
        if (!transformations) {
          transformations = [];
          this.discriminatorTransformations.set(transformation.discriminator, transformations);
        }
        transformations.push(transformation);
      } else {
        this.transformations.push(transformation);
      }
    });
  }

  /**
   * Returns all transformations which potentially apply to the given document.
   *
   * This function will only return DiscriminatorTransformations for documents with the according discriminator type.
   *
   * @param {LeanDoc<TVersions>} lean - The Lean document for which to retrieve transformations.
   * @return {IDocumentTransformation<TVersions>[]}
   */
  override getTransformations(lean: LeanDoc<TVersions>): IDocumentTransformation<TVersions>[] {
    const discriminatorTransformations =
      this.discriminatorTransformations.get(this.getDiscriminator(lean)) || [];
    return [...this.transformations, ...discriminatorTransformations];
  }
}

/**
 * A class representing a special type of DiscriminatorDocumentTransformer for collections using the `type` field
 * as discriminator field.
 *
 * @typeparam T - The type of the base document that the transformer operates on.
 * @typeparam TVersions - The type of the base document with versions. Defaults to T.
 */
export class DocumentTypeTransformer<
  T extends BaseDocument & { type: string },
  TVersions extends BaseDocument & { type: string } = T,
> extends DiscriminatorDocumentTransformer<T, TVersions> {
  protected override getDiscriminator(leanDoc: LeanDoc<TVersions>): string {
    return leanDoc.type;
  }
}
