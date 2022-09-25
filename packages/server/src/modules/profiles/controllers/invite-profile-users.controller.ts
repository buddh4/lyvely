import { ProfileController } from "../decorators";
import { ENDPOINT_INVITE_PROFILE_USERS, InviteProfileMembers, InviteProfileUsersEndpoint } from "@lyvely/common";
import { UseClassSerializer } from "../../core";
import { SomePermissions } from '../../permissions/decorators/permissions.decorator';
import { Body, Post, HttpCode, HttpStatus, Request } from "@nestjs/common"
import { ProfileRequest } from "../../core/types";
import { ProfilePermissions } from "../permissions";
import { InviteProfileUsersService } from "../services/invite-profile-users.service";

@ProfileController(ENDPOINT_INVITE_PROFILE_USERS)
@UseClassSerializer()
export class InviteProfileUsersController implements InviteProfileUsersEndpoint {

  constructor(private readonly inviteProfileUsersService: InviteProfileUsersService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @SomePermissions(ProfilePermissions.INVITE_MEMBER)
  async inviteMembers(@Body() inviteUsers: InviteProfileMembers, @Request() req: ProfileRequest) {
    const { user, profileRelations } = req;
    const mailInvites = inviteUsers.mailInvites.map(invite => this.inviteProfileUsersService.inviteUserByMail(profileRelations, invite));

    return Promise.all(mailInvites);
  }

}
