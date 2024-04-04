import { Injectable, type OnModuleInit } from '@nestjs/common';
import { FileMimeTypeRegistry } from './registries';
import { FileMetadata, ImageFile, ImageFileMetadata } from './schemas';
import type { IFileTypeDefinition, IFileUpload } from './interfaces';
import sharp from 'sharp';

@Injectable()
export class FilesEvents implements OnModuleInit {
  constructor(private readonly fileTypeRegistry: FileMimeTypeRegistry) {}

  onModuleInit() {
    const getUploadFileMeta = (upload: IFileUpload<ImageFile>): Partial<FileMetadata> => {
      const { filename, mimetype, size } = upload.file;
      return { filename, mimetype, size };
    };

    const imageTypeDefinition: IFileTypeDefinition<ImageFile> = {
      async metaFactory(upload: IFileUpload<ImageFile>): Promise<ImageFileMetadata> {
        const image = sharp(upload.file.path);
        const metadata = await image.metadata();
        return new ImageFileMetadata({
          ...getUploadFileMeta(upload),
          height: metadata.height,
          width: metadata.width,
        });
      },
    };

    this.fileTypeRegistry.registerType(ImageFile, 'image/jpeg', imageTypeDefinition);
    this.fileTypeRegistry.registerType(ImageFile, 'image/jpg', imageTypeDefinition);
    this.fileTypeRegistry.registerType(ImageFile, 'image/png', imageTypeDefinition);
    this.fileTypeRegistry.registerType(ImageFile, 'image/gif', imageTypeDefinition);
    this.fileTypeRegistry.registerType(ImageFile, 'image/webp', imageTypeDefinition);
    this.fileTypeRegistry.registerType(ImageFile, 'image/avif', imageTypeDefinition);
    this.fileTypeRegistry.registerType(ImageFile, 'image/tiff', imageTypeDefinition);
  }
}
