import { SetMetadata } from '@nestjs/common';
import { Content } from '../schemas';
import { Type } from '@lyvely/common';
import { META_CONTENT_TYPE } from '../content.constants';

export const StrictContentType = (type: string | Type<Content>) =>
  SetMetadata(META_CONTENT_TYPE, type);
