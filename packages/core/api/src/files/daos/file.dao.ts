import { AbstractDao, LeanDoc, type Model } from '@/core';
import { File, GenericFile } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import type { Type } from '@lyvely/common';
import { FileTypeRegistry } from '../registries';
import { Inject } from '@nestjs/common';

/**
 * Represents a DAO (Data Access Object) for managing files.
 *
 * @extends AbstractDao<File>
 */
export class FileDao extends AbstractDao<File> {
  @InjectModel(File.name)
  protected readonly model: Model<File>;

  @Inject()
  protected readonly fileTypeRegistry: FileTypeRegistry;

  /**
   * Returns the module identifier.
   *
   * @return {string} The module identifier.
   */
  override getModuleId(): string {
    return 'files';
  }

  /**
   * Returns the model constructor based on the given leanModel.
   *
   * @param {LeanDoc<File>} leanModel - The leanModel object.
   * @return {Type<File>} - The model constructor.
   */
  override getModelConstructor(leanModel: LeanDoc<File>): Type<File> {
    return this.fileTypeRegistry.getTypeConstructor(leanModel.type) || GenericFile;
  }
}
