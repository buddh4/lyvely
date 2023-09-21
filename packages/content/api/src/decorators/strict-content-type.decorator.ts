import { SetMetadata } from '@nestjs/common';
import { Content } from '../schemas';
import { Type } from '@lyvely/common';
import { CONTENT_TYPE_KEY } from '../content.constants';

export const StrictContentType = (type: string | Type<Content>) =>
  SetMetadata(CONTENT_TYPE_KEY, type);
