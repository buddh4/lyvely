import { join } from 'node:path';
import fs from 'node:fs';
import { rimrafSync } from 'rimraf';

export function testStorageFileExists(bucket: string, file: string) {
  return fs.existsSync(getTestStorageFilePath(bucket, file));
}

export function getTestStorageFilePath(bucket: string, file: string) {
  return join(process.cwd(), 'storage', 'test', bucket, file);
}

export function clearTestStorage(bucket?: string) {
  const localStorage = bucket
    ? join(process.cwd(), 'storage', 'test', bucket)
    : join(process.cwd(), 'storage', 'test');

  rimrafSync(localStorage);
}
