import type { IFileTypeDefinition } from '../interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractTypeRegistry } from '@/core';
import { File } from '../schemas';

/**
 * A registry for registering file types with definition by mime-type.
 * @class FileMimeTypeRegistry
 * @extends AbstractTypeRegistry
 * @template File - The file type.
 * @template IFileTypeDefinition - The definition of a file type.
 */
@Injectable()
export class FileMimeTypeRegistry extends AbstractTypeRegistry<File, IFileTypeDefinition<File>> {
  protected logger = new Logger(FileMimeTypeRegistry.name);
}
