import { Injectable, type OnModuleInit } from '@nestjs/common';
import { FileMimeTypeRegistry } from './registries';
import { FileMetadata, ImageFile, ImageFileMetadata } from './schemas';
import type { IFileTypeDefinition, IFileUpload } from './interfaces';
import sharp from 'sharp';
import { isMemoryFile } from '@/files/helpers/file-info.helper';
import { IMAGE_MIME_TYPES } from '@/files/files.constants';

@Injectable()
export class FilesEvents implements OnModuleInit {
  constructor(private readonly fileTypeRegistry: FileMimeTypeRegistry) {}

  onModuleInit() {
    const getUploadFileMeta = ({ file }: IFileUpload<ImageFile>): Partial<FileMetadata> => {
      const { originalname: name, mimetype: mimeType, size } = file;
      return { name, mimeType, size };
    };

    const imageTypeDefinition: IFileTypeDefinition<ImageFile> = {
      async metaFactory(upload: IFileUpload<ImageFile>): Promise<ImageFileMetadata> {
        const { file } = upload;
        const image = sharp(isMemoryFile(file) ? file.buffer : file.path);
        const metadata = await image.metadata();
        return new ImageFileMetadata({
          ...getUploadFileMeta(upload),
          height: metadata.height,
          width: metadata.width,
        });
      },
    };

    IMAGE_MIME_TYPES.forEach((mime) =>
      this.fileTypeRegistry.registerType(ImageFile, mime, imageTypeDefinition)
    );
  }
}
