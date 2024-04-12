import { AvatarService, STORAGE_BUCKET_AVATARS } from '@/avatars';
import {
  buildTest,
  clearTestStorage,
  getTestStorageFilePath,
  LyvelyTestingModule,
  testStorageFileExists,
} from '@/testing';
import { FilesModule } from '@/files/files.module';
import { createObjectId, uniqueGuid, variantGuid } from '@/core';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type { IDiskFileInfo, IMemoryFileInfo } from '@/files';
import { AVATAR_SIZE, AVATAR_SIZE_LG, AVATAR_VARIANT_LG } from '@lyvely/interface';

describe('AvatarService', () => {
  let testingModule: LyvelyTestingModule;
  let avatarService: AvatarService;
  let testMemoryAvatar: IMemoryFileInfo;
  let testDiskAvatar: IDiskFileInfo;

  const TEST_KEY = 'AvatarService';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .imports([FilesModule])
      .providers([AvatarService])
      .compile();
    avatarService = testingModule.get(AvatarService);
  });

  afterEach(async () => {
    clearTestStorage();
    deleteAllExceptOne();
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('Should be defined', () => {
    expect(avatarService).toBeDefined();
  });

  const getBufferedAvatar = (): IMemoryFileInfo => {
    if (!testMemoryAvatar) {
      const avatarPath = path.join(__dirname, '../testing/data/avatar.jpeg');
      const buffer = fs.readFileSync(avatarPath);
      testMemoryAvatar = {
        originalname: 'avatar.jpeg',
        size: buffer.byteLength,
        mimetype: 'image/jpeg',
        buffer: buffer,
      };
    }
    return testMemoryAvatar;
  };

  const getDiskAvatar = (): IDiskFileInfo => {
    if (!testDiskAvatar) {
      const avatarPath = path.join(__dirname, '../testing/data/avatar.jpeg');
      const buffer = fs.readFileSync(avatarPath);
      testDiskAvatar = {
        originalname: 'avatar.jpeg',
        size: buffer.byteLength,
        mimetype: 'image/jpeg',
        path: avatarPath,
      };
    }
    return testDiskAvatar;
  };

  function deleteAllExceptOne() {
    const avatarPath = path.join(__dirname, '../testing/data');
    // read the files in the directory
    fs.readdir(avatarPath, (err, files) => {
      if (err) throw err;

      // loop through each file in the directory
      for (const file of files) {
        // form full file path
        const filePath = path.join(avatarPath, file);

        // check if it is not the exception file
        if (path.basename(filePath) !== 'avatar.jpeg') {
          // deleting file
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`Deleted file: ${file}`);
          });
        }
      }
    });
  }

  describe('upload', () => {
    describe('memory file', () => {
      it('upload buffer image with given guid', async () => {
        const guid = uniqueGuid();
        const lgGuid = variantGuid(guid, AVATAR_VARIANT_LG);
        await avatarService.createAvatar(createObjectId(), getBufferedAvatar(), guid);
        await expectDimensions(guid, AVATAR_SIZE);
        await expectDimensions(lgGuid, AVATAR_SIZE_LG);
      });

      it('upload buffer image without guid', async () => {
        const avatar = await avatarService.createAvatar(createObjectId(), getBufferedAvatar());
        const lgGuid = variantGuid(avatar.guid, AVATAR_VARIANT_LG);
        await expectDimensions(avatar.guid, AVATAR_SIZE);
        await expectDimensions(lgGuid, AVATAR_SIZE_LG);
      });
    });

    describe('disk file', () => {
      it('upload disk image with given guid', async () => {
        const guid = uniqueGuid();
        const lgGuid = variantGuid(guid, AVATAR_VARIANT_LG);
        await avatarService.createAvatar(createObjectId(), getDiskAvatar(), guid);
        await expectDimensions(guid, AVATAR_SIZE);
        await expectDimensions(lgGuid, AVATAR_SIZE_LG);
      });
    });
  });

  async function expectDimensions(guid: string, size: number) {
    try {
      const imagePath = getTestStorageFilePath(STORAGE_BUCKET_AVATARS, guid);
      expect(testStorageFileExists(STORAGE_BUCKET_AVATARS, guid)).toEqual(true);

      const image = sharp(imagePath);
      const metadata = await image.metadata();
      expect(metadata.width).toEqual(size);
      expect(metadata.height).toEqual(size);

      return { width: metadata.width, height: metadata.height };
    } catch (err) {
      console.error(err);
      return null;
    }
  }
});
