import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '@/config';

export function getLocalUploadFilePath(
  configService: ConfigService<ConfigurationPath>,
  ...path: Array<string>
) {
  const uploadPath = configService.get('file.local.path') || join(process.cwd(), 'uploads');
  return path?.length ? join(uploadPath, ...path) : uploadPath;
}
