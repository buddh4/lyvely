import { SetMetadata } from '@nestjs/common';
import { META_CONTENT_ID_PARAM } from '../content.constants';

export const ContentIdParam = (contentIdParamName: string) =>
  SetMetadata(META_CONTENT_ID_PARAM, contentIdParamName);
