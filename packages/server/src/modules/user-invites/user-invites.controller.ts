import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { UserInvites } from '@lyvely/common';
import { UserInvitesService } from "./user-invites.service";
import { UseClassSerializer } from "../core";
import { UserInvitesEndpoint, ENDPOINT_USER_INVITES } from "@lyvely/common";
import { Feature } from "../core/features/feature.decorator";

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
