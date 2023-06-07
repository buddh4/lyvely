import { Controller, Get, Param, Headers, Req } from '@nestjs/common';
import { LegalEndpoint, LegalSectionDetails, ENDPOINT_LEGAL } from '@lyvely/common';
import { LegalService } from '../services/legal.service';
import { Public } from '@/core';
import { PublicRequest } from '@/users';

@Controller(ENDPOINT_LEGAL)
export class LegalController implements LegalEndpoint {
  constructor(private readonly legalService: LegalService) {}

  @Public()
  @Get(':sectionId')
  async getLegalDetails(
    @Param('sectionId') sectionId,
    @Req() req: PublicRequest,
    @Headers('accept-language') acceptLanguage?: string,
  ): Promise<LegalSectionDetails> {
    return this.legalService.getDetails(sectionId, req.user?.locale || acceptLanguage);
  }
}
