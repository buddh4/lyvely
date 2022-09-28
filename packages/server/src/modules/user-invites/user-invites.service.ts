import { Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles';
import { MailService } from '../mails/services/mail.service';
import { UserInvites } from '@lyvely/common';
import { User } from '../users';

@Injectable()
export class UserInvitesService {
  constructor(private profileService: ProfilesService, private mailerService: MailService) {}

  public async inviteUsers(host: User, invites: UserInvites) {
    // Is host allowed to invite users
  }
}
