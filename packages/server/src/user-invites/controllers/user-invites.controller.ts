import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { UserInvitesService } from '../services/user-invites.service';
import { UserInvitesEndpoint, ENDPOINT_USER_INVITES, UserInvites } from '@lyvely/common';
import { UseClassSerializer } from '@/core';
@Controller(ENDPOINT_USER_INVITES)
@UseClassSerializer()
export class UserInvitesController implements UserInvitesEndpoint {
  constructor(private inviteService: UserInvitesService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async inviteUsers(@Body() invite: UserInvites) {}
}