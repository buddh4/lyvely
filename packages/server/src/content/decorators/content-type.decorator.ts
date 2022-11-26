import { SetMetadata } from '@nestjs/common';
import { Content } from '../schemas';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { CONTENT_TYPE_KEY } from '../content.constants';

export const ContentType = (type: string | Type<Content>) => SetMetadata(CONTENT_TYPE_KEY, type);
