import { Controller as NestController, UseGuards } from '@nestjs/common';
import { CanActivate } from '@nestjs/common/interfaces';
import { PolicyGuard } from '@/policies/guards';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ProfileController = (
  prefix: string | string[],
  ...guards: (CanActivate | Function)[]
) => {
  return function (target: any) {
    NestController(prefix)(target);
    UseGuards(PolicyGuard, ...guards)(target);
  };
};
