import { Controller, HttpCode, HttpStatus, Post, Body, Req, Get, Param } from '@nestjs/common';
import {
  SendInvitationsService,
  MailInvitationService,
  UserInvitationsService,
  InvitationsService,
} from '../services';
import {
  UserInvitationsEndpoint,
  ENDPOINT_USER_INVITATIONS,
  InvitationRequest,
  UserInvitationsEndpointPaths,
} from '@lyvely/interface';
import { Public, UseClassSerializer } from '@/core';
import { UserRequest } from '@/users';

@Controller(ENDPOINT_USER_INVITATIONS)
@UseClassSerializer()
export class InvitationsController implements UserInvitationsEndpoint {
  constructor(
    private invitationsService: InvitationsService,
    private sendInviteService: SendInvitationsService,
    private mailInviteService: MailInvitationService,
    private userInviteService: UserInvitationsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendInvitations(@Body() invites: InvitationRequest, @Req() req: UserRequest) {
    await this.sendInviteService.sendInvitations(req.user, invites);
  }

  @Public()
  @Get(UserInvitationsEndpointPaths.MAIL(':t'))
  async getMailInvitationInfo(@Param('t') token: string) {
    return await this.mailInviteService.getInvitationInfo(token);
  }

  @Get(UserInvitationsEndpointPaths.USER(':pid'))
  async getUserInvitationInfo(@Param('pid') profile: string, @Req() req: UserRequest) {
    const { user } = req;
    return await this.userInviteService.getInvitationInfo({ user, profile });
  }

  @Post(UserInvitationsEndpointPaths.ACCEPT(':pid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async accept(@Param('pid') pid: string, @Req() req: UserRequest) {
    await this.invitationsService.acceptUserInvitation(req.user, pid);
  }

  @Post(UserInvitationsEndpointPaths.DECLINE(':pid'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async decline(@Param('pid') pid: string, @Req() req: UserRequest) {
    await this.invitationsService.declineUserInvitation(req.user, pid);
  }
}
