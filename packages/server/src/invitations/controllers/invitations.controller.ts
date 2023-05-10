import { Controller, HttpCode, HttpStatus, Post, Body, Req, Get, Param } from '@nestjs/common';
import { SendInvitationsService, MailInvitesService } from '../services';
import { InvitationsEndpoint, ENDPOINT_INVITATIONS, InvitationRequest } from '@lyvely/common';
import { Public, UseClassSerializer } from '@/core';
import { UserRequest } from '@/users';

@Controller(ENDPOINT_INVITATIONS)
@UseClassSerializer()
export class InvitationsController implements InvitationsEndpoint {
  constructor(
    private sendInviteService: SendInvitationsService,
    private mailInviteService: MailInvitesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendInvitations(@Body() invites: InvitationRequest, @Req() req: UserRequest) {
    await this.sendInviteService.sendInvitations(req.user, invites);
  }

  @Public()
  @Get('mail/:t')
  async getMailInvitationInfo(@Param('t') token: string) {
    return await this.mailInviteService.getMailInvitationInfo(token);
  }
}
