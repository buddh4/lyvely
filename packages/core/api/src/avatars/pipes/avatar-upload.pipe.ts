import { ImagePipeBuilder } from '@/files';
import { AVATAR_SIZE_LG } from '@lyvely/interface';

export const AvatarUploadPipe = new ImagePipeBuilder()
  .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 }) // 2MB (scaled in frontend)
  .resize(AVATAR_SIZE_LG)
  .build();
