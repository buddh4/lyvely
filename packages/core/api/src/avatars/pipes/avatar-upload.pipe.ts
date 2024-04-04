import { ImagePipeBuilder } from '@/files';

export const AvatarUploadPipe = new ImagePipeBuilder()
  .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 }) // 2MB (scaled in frontend)
  .resize(64)
  .build();
