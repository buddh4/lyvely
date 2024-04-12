# Files & Storage

Lyvely provides a storage abstraction to manage files, enabling the implementation and configuration of various storage 
providers for different purposes.

## File Upload

Lyvely utilizes [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload) for uploading and validating files.

### File Upload Module

To implement a file upload endpoint within your custom module, import the `MulterModule` as follows:


```typescript
import { MulterConfigFactory } from "@lyvely/api";
import { MulterModule } from "@nestjs/platform-express";

@Module({
  providers: [MyFilesService],
  controllers: [MyFileController],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigFactory,
    }),
  ],
})
export class MyModule {
}
```

## Image Upload

For image uploading, which often involves validation and resizing, Lyvely offers the `ImagePipeBuilder` helper class:

```typescript title=pipes/my-image.pipe.ts
export const MyImagePipe = new ImagePipeBuilder()
  .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 }) // 2MB (scaled in frontend)
  .resize(2500) // Limit width to 2500px
  .build();
```

```typescript title=controllers/my-file.controller.ts
@ProfileController(API_MY_MODULE)
export class MyFileController {
  @Post(MyEndpoints.UPLOAD_IMAGE)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(MyImagePipe) file: IFileInfo,
    @Req() req: ProfileMembershipRequest,
  ): Promise<FileModel> {
    return new FileModel(await this.fileService.uploadImage(req.user, file));
  }

  @Get(':guid')
  @Header('Cross-Origin-Resource-Policy', 'cross-origin')
  public async download(@Param('guid') guid, @Res() res: Response) {
    const fileStream = await this.fileService.download(guid);

    if (!fileStream) throw new NotFoundException();

    res.set({ 'Content-Type': 'image/jpeg' });
    fileStream.pipe(res);
  }
}
```

:::info
The `IFileInfo` interface abstracts `Express.Multer.File` files, extensively used within the file storage API for 
uploading or transforming files.
:::

## StorageService

The `StorageService` provides an abstraction layer for storage providers and facilitates file access and upload:

```typescript
import type { IFileInfo } from "@lyvely/api";

@Injectable()
export class MyFilesService {
  constructor(private readonly storageService: StorageService) {
  }

  async uploadImage(user: User, upload: IFileInfo): Promise<File> {
    return this.storageService.upload(new FileUpload({
      file,
      bucket: MY_STORAGE_BUCKET,
      createdBy: assureObjectId(user),
    }))
  }
  
  async download(guid: string): Promise<Readable | null> {
    return this.storageService.download({
      guid,
      bucket: MY_STORAGE_BUCKET
    })
  }
}
```

### Custom storage provider

The storage server manages buckets and storage providers. A storage provider must implement the `IStorageProvider` 
interface or extend the abstract `StorageProvider` class:

```typescript
export class MyStorageProvider extends StorageProvider<MyStorageProviderOptions> {

  async upload(upload: FileUpload): Promise<void> {
    if (isMemoryFile(file)) {
      // Write to storage from file.buffer
    } else {
      // Write to storage from file.path
    }
  }

  async delete(file: FileAccess): Promise<void> {
    // Delete file from storage by using file.bucket and file.guid.
  }

  async download(file: FileAccess): Promise<stream.Readable | null> {
    // Create Readable stream by access the file from storage file.bucket and file.guid.
  }
  
  async initialize(): Promise<void> {
    // Can be used for any async initialization logic at startup
  }
}
```

It is possible to configure multiple storage providers for your application and assign a storage provider to a specific
bucket or use it as the default provider. For example, you can use a different storage provider for avatars and 
uploaded files.

