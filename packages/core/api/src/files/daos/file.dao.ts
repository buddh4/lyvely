import { AbstractDao, Dao } from '@/core';
import { File } from '../schemas';
import { FileTypeRegistry } from '../registries';
import { Inject } from '@nestjs/common';
import { TenancyIsolation } from '@/core/tenancy';

/**
 * Represents a DAO (Data Access Object) for managing files.
 *
 * @extends AbstractDao<File>
 */
@Dao(File, { isolation: TenancyIsolation.Strict })
export class FileDao extends AbstractDao<File> {
  @Inject()
  protected override typeRegistry: FileTypeRegistry;
}
