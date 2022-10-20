import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { UserInvitesService } from './user-invites.service';
import { UserInvitesEndpoint, ENDPOINT_USER_INVITES, UserInvites } from '@lyvely/common';
import { Feature, UseClassSerializer } from '../core';

@Controller(ENDPOINT_USER_INVITES)
@Feature('user.invite')
@UseClassSerializer()
export class UserInvitesController implements UserInvitesEndpoint {
  constructor(private inviteService: UserInvitesService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async inviteUsers(@Body() invite: UserInvites) {
    // Is host allowed to invite users?
  }
}
