import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/core';

export function getLocalFilePath(path: string, configService: ConfigService<ConfigurationPath>) {
  return join(configService.get('file.local.path') || join(process.cwd(), 'uploads'), path);
}
