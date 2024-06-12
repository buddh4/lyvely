import { HttpCode, HttpStatus, Post, Req, Get, Param } from '@nestjs/common';
import {
  SendInvitationsService,
  MailInvitationService,
  UserInvitationsService,
  InvitationsService,
} from '../services';
import {
  UserInvitationsEndpoint,
  API_USER_INVITATIONS,
  InvitationRequest,
  UserInvitationsEndpoints,
  UserRole,
} from '@lyvely/interface';
import { Public, ValidBody } from '@/core';
import { GlobalController } from '@/common';
import { UserRequest, UserRoleAccess } from '@/users';

@GlobalController(API_USER_INVITATIONS)
export class InvitationsController implements UserInvitationsEndpoint {
  constructor(
    private invitationsService: InvitationsService,
    private sendInviteService: SendInvitationsService,
    private mailInviteService: MailInvitationService,
    private userInviteService: UserInvitationsService
  ) {}

  @Post()
  @UserRoleAccess(UserRole.User)
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendInvitations(@ValidBody() invites: InvitationRequest, @Req() req: UserRequest) {
    await this.sendInviteService.sendInvitations(req.user, invites);
  }

  @Public()
  @Get(UserInvitationsEndpoints.MAIL(':t'))
  async getMailInvitationInfo(@Param('t') token: string) {
    return await this.mailInviteService.getInvitationInfo(token);
  }

  @UserRoleAccess(UserRole.User)
  @Get(UserInvitationsEndpoints.USER(':pid'))
  async getUserInvitationInfo(@Param('pid') profile: string, @Req() req: UserRequest) {
    const { user } = req;
    return await this.userInviteService.getInvitationInfo({ user, profile });
  }

  @UserRoleAccess(UserRole.User)
  @Post(UserInvitationsEndpoints.ACCEPT(':pid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async accept(@Param('pid') pid: string, @Req() req: UserRequest) {
    await this.invitationsService.acceptUserInvitation(req.user, pid);
  }

  @UserRoleAccess(UserRole.User)
  @Post(UserInvitationsEndpoints.DECLINE(':pid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async decline(@Param('pid') pid: string, @Req() req: UserRequest) {
    await this.invitationsService.declineUserInvitation(req.user, pid);
  }
}
