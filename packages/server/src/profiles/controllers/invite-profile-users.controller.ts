import { ProfileController, SomeProfilePermissions } from '../decorators';
import {
  ENDPOINT_INVITE_PROFILE_USERS,
  InviteProfileMembers,
  InviteProfileUsersEndpoint,
} from '@lyvely/common';
import { UseClassSerializer } from '@/core';
import { Body, Post, HttpCode, HttpStatus, Request } from '@nestjs/common';
import { ProfileRequest } from '../types';
import { ProfilePermissions } from '../permissions';
import { InviteProfileUsersService } from '../services/invite-profile-users.service';

@ProfileController(ENDPOINT_INVITE_PROFILE_USERS)
@UseClassSerializer()
export class InviteProfileUsersController implements InviteProfileUsersEndpoint {
  constructor(private readonly inviteProfileUsersService: InviteProfileUsersService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @SomeProfilePermissions(ProfilePermissions.INVITE_MEMBER)
  async inviteMembers(@Body() inviteUsers: InviteProfileMembers, @Request() req: ProfileRequest) {
    const { context } = req;
    const mailInvites = inviteUsers.mailInvites.map((invite) =>
      this.inviteProfileUsersService.inviteUserByMail(context, invite),
    );

    return Promise.all(mailInvites);
  }
}
