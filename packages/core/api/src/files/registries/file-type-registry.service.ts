import { Injectable, Logger } from '@nestjs/common';
import { AbstractTypeRegistry } from '@/core';
import { File } from '../schemas';

/**
 * A registry for registering file types.
 * @class FileMimeTypeRegistry
 * @extends AbstractTypeRegistry
 * @template File - The file type.
 * @template IFileTypeDefinition - The definition of a file type.
 */
@Injectable()
export class FileTypeRegistry extends AbstractTypeRegistry<File> {
  protected logger = new Logger(FileTypeRegistry.name);
}
