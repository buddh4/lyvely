import { Injectable } from '@nestjs/common';
import { type Type } from '@lyvely/common';
import { InjectModel } from '@nestjs/mongoose';
import { META_DAO } from '@/core/db/db.constants';
import { type BaseDocument, type LeanDoc } from '@/core/db/interfaces';
import { AbstractTypeRegistry } from '@/core/components';
import type { TenancyIsolation } from '@/core/tenancy';

/**
 * Represents the metadata for a Dao class.
 *
 * @template T - The type of the base document.
 */
export interface IDaoMetadata<T extends BaseDocument> {
  /** A document type. **/
  type: Type<T>;

  /** Can be overwritten to define a custom modelName instead of type.name. **/
  modelName?: string;

  /**
   * Defines the tenancy isolation level of the documents managed by this Dao.
   * - None: this Dao's documents will never be isolated and always be part of the main db.
   * - Profile(default): this Dao's documents contains profile related data which may be isolated from the main db if isolation is active.
   * - Strict: this Dao's documents will only be isolated in case of a strict isolation configuration.
   **/
  isolation?: TenancyIsolation;

  /** A discriminator strategy. **/
  discriminator?:
    | Record<string, Type<T>>
    | ((leanModel: LeanDoc<T>) => Type<T>)
    | AbstractTypeRegistry<T>;
}

/**
 * Decorator function for creating a DAO (Data Access Object) class.
 *
 * @param {Type<T>} type - The class type of the document.
 * @param {Partial<IDaoMetadata<T>>} [meta] - Additional metadata for the DAO.
 * @returns {ClassDecorator} - The decorator function to be applied on the DAO class.
 */
export const Dao = <T extends BaseDocument>(
  type: Type<T>,
  meta?: Omit<IDaoMetadata<T>, 'type'>
): ClassDecorator => {
  const injectable = Injectable();
  const injectModel = InjectModel(meta?.modelName || type.name);

  return (target: any) => {
    Reflect.defineMetadata(META_DAO, { type, ...meta } satisfies IDaoMetadata<T>, target);
    injectable(target);
    injectModel(target.prototype, 'model');
    return target;
  };
};
