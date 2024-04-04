import type { IDiskFileInfo, IFileInfo, IMemoryFileInfo } from '@/files';
import { isNil } from '@lyvely/common';

export function isMemoryFile(file: IFileInfo | Express.Multer.File): file is IMemoryFileInfo {
  return 'buffer' in file && !isNil(file.buffer);
}

export function isDiskFile(file: IFileInfo | Express.Multer.File): file is IDiskFileInfo {
  return 'path' in file && !isNil(file.path);
}
