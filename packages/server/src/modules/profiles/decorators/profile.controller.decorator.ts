import { Controller, UseGuards } from '@nestjs/common';
import { ProfileGuard } from "../guards";
import { CanActivate } from '@nestjs/common/interfaces';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ProfileController = (prefix: string | string[], ...guards: (CanActivate | Function)[] ) => {
  const controller = Controller(prefix);
  const profileGuard = UseGuards(ProfileGuard, ...guards);

  return function (target: any) {
    controller(target);
    profileGuard(target)
  }
}
