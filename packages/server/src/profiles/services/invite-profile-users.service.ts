import { Injectable } from '@nestjs/common';
import { ProfileMemberMailInvite } from '@lyvely/common';
import { ProfilePermissionsService } from './profile-permissions.service';
import { ProfileContext } from '../models';
import { validateEmail } from '@/core';
import { UsersService } from '@/users';
import { MailService } from '@/mails';

@Injectable()
export class InviteProfileUsersService {
  constructor(
    private readonly profilePermissionsService: ProfilePermissionsService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async inviteUserByMail(userWithRelations: ProfileContext, invite: ProfileMemberMailInvite): Promise<boolean> {
    if (
      !this.profilePermissionsService.userInheritsRole(userWithRelations, invite.role) ||
      !validateEmail(invite.email)
    ) {
      return false;
    }

    const existingUser = await this.usersService.findUserByMainEmail(invite.email);

    // Create invite token

    if (existingUser) {
      // TODO: Send notification to existing user
      // Create invitation url with token
      /**
       *
       * this.notificationService.push(new UserProfileInvite({
       *    ....
       * }))
       */
    } else {
      // Create registration url with invitation token
      this.mailService.sendMail({
        to: invite.email,
      });
    }
  }
}
