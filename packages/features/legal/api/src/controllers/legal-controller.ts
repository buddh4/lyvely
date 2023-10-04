import { Controller, Get, Param, Headers, Req, NotFoundException } from '@nestjs/common';
import { LegalEndpoint, LegalSectionDetails, ENDPOINT_LEGAL } from '@lyvely/legal-interface';
import { LegalService } from '../services/legal.service';
import { Public } from '@lyvely/core';
import { PublicRequest } from '@lyvely/users';

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
    const section = await this.legalService.getDetails(
      sectionId,
      req.user?.locale || acceptLanguage,
    );
    if (!section) throw new NotFoundException();
    return section;
  }
}
