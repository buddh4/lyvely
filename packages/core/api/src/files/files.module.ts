import { LyvelyModule } from '@/core';
import { FILES_MODULE_ID } from '@lyvely/interface';
import { StorageService } from './services';
import { Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  File,
  FileSchema,
  GenericFile,
  GenericFileSchema,
  ImageFile,
  ImageFileSchema,
} from './schemas';
import { FileMimeTypeRegistry, FileTypeRegistry } from './registries';

@Global()
@LyvelyModule({
  id: FILES_MODULE_ID,
  path: __dirname,
  imports: [
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema,
        discriminators: [
          { name: ImageFile.fileType, schema: ImageFileSchema },
          { name: GenericFile.fileType, schema: GenericFileSchema },
        ],
      },
    ]),
  ],
  providers: [StorageService, FileMimeTypeRegistry, FileTypeRegistry],
  exports: [StorageService],
})
export class FilesModule {}
