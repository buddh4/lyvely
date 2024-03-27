import { Controller, UseGuards } from '@nestjs/common';
import { ProfileGuard } from '../guards';
import { CanActivate } from '@nestjs/common/interfaces';
import { PolicyGuard } from '@/policies/guards';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ProfileController = (
  prefix: string | string[],
  ...guards: (CanActivate | Function)[]
): ClassDecorator => {
  const controller = Controller(prefix);
  const profileGuard = ProfileEndpoint(...guards);

  return function (target: any) {
    controller(target);
    profileGuard(target);
  };
};

export const ProfileEndpoint = (
  ...guards: (CanActivate | Function)[]
): MethodDecorator & ClassDecorator => {
  const profileGuard = UseGuards(ProfileGuard, PolicyGuard, ...guards);

  return function (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) {
    if (key && descriptor) {
      profileGuard(target, key, descriptor);
    }
    profileGuard(target);
  };
};
