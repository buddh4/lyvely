import { Injectable } from '@nestjs/common';
import { ProfileMemberMailInvite } from "@lyvely/common";
import { ProfilePermissionsService } from "../../permissions/services/profile-permissions.service";
import { UserWithProfileAndRelations } from "../models";
import { validateEmail } from "../../core/db/field.validator.util";

@Injectable()
export class InviteProfileUsersService {
  constructor(private readonly profilePermissionsService: ProfilePermissionsService) {}

  async inviteUserByMail(userWithRelations: UserWithProfileAndRelations, invite: ProfileMemberMailInvite): Promise<boolean> {
    if(!this.profilePermissionsService.userInheritsRole(userWithRelations, invite.role) || !validateEmail(invite.email)) {
      return false;
    }


  }
}
