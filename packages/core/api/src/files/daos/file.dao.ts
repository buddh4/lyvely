import { AbstractDao, Dao } from '@/core';
import { File } from '../schemas';
import { FileTypeRegistry } from '../registries';
import { Inject } from '@nestjs/common';

/**
 * Represents a DAO (Data Access Object) for managing files.
 *
 * @extends AbstractDao<File>
 */
@Dao(File)
export class FileDao extends AbstractDao<File> {
  @Inject()
  protected override typeRegistry: FileTypeRegistry;
}
