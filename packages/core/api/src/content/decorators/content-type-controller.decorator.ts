import { Controller, UseGuards } from '@nestjs/common';
import { StrictContentType } from './strict-content-type.decorator';
import { Content } from '../schemas';
import { ContentGuard } from '../guards';
import { Type } from '@lyvely/common';
import { PolicyGuard } from '@/policies/guards';
import type { IControllerOptions } from '@/common';
import { UseClassSerializer } from '@/core';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ContentTypeController = (
  prefix: string | string[],
  contentType?: string | Type<Content>,
  options?: IControllerOptions
) => {
  const controller = Controller(prefix);
  const useClassSerializer = UseClassSerializer();
  const guards = options?.guards || [];
  const profileGuard = UseGuards(ContentGuard, PolicyGuard, ...guards);
  const contentTypeGuard = contentType ? StrictContentType(contentType) : false;

  return function (target: any) {
    controller(target);
    profileGuard(target);

    if (contentTypeGuard) {
      contentTypeGuard(target);
    }

    if (options?.serialize !== false) {
      useClassSerializer(target);
    }
  };
};
