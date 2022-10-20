import { Controller, UseGuards } from '@nestjs/common';
import { ProfileGuard } from '../../profiles';
import { CanActivate } from '@nestjs/common/interfaces';
import { ContentType } from './content-type.decorator';
import { Content } from '../schemas';
import { ContentGuard } from '../guards';
import { Type } from '@nestjs/common/interfaces/type.interface';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ContentController = (
  prefix: string | string[],
  contentType?: string | Type<Content>,
  ...guards: (CanActivate | Function)[]
) => {
  const controller = Controller(prefix);
  const profileGuard = UseGuards(ProfileGuard, ContentGuard, ...guards);
  const contentTypeGuard = contentType ? ContentType(contentType) : false;

  return function (target: any) {
    controller(target);
    profileGuard(target);

    if (contentTypeGuard) {
      contentTypeGuard(target);
    }
  };
};
